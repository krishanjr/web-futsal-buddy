import { UserMongoRepository } from "../repositories/user.repository";
import { NotifyService } from "../repositories/notification.repository";
import { RegisterDTO, LoginDTO, UpdateUserDTO, SelfUpdateProfileDTO, ChangePasswordDTO, ForgotPasswordDTO, GoogleLoginDTO, VerifyResetOtpDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { firebaseAuth } from "../configs/firebase-admin";
import { sendOtpEmail } from "../configs/mailer";

const userRepository = new UserMongoRepository();

function issueToken(user: IUser): string {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "30d" });
}

function usernameFromEmail(email: string): string {
    const base = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "user";
    return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

export class UserService {
    async register(userData: RegisterDTO): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already registered");
        }

        const existingUsername = await userRepository.getUserByUsername(userData.username);
        if (existingUsername) {
            throw new HttpException(400, "Username already taken");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;

        const user = await userRepository.createUser(userData as Partial<IUser>);

        if (user.role === "organizer") {
            const allUsers = await userRepository.getAll();
            const admins = allUsers.filter((u) => u.role === "admin");
            await Promise.all(
                admins.map((admin) =>
                    NotifyService.send(
                        admin._id.toString(),
                        "new_organizer_registration",
                        `${user.firstName} ${user.lastName} (${user.email}) registered as an organizer`,
                        user._id.toString()
                    )
                )
            );
        }

        return user;
    }

    async login(loginData: LoginDTO): Promise<{ user: IUser; token: string }> {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email or password");
        }

        if (!user.isActive) {
            throw new HttpException(403, "Your account has been deactivated");
        }

        const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid email or password");
        }

        const token = issueToken(user);

        // Remove password from response
        const userObj = user.toObject();
        delete (userObj as any).password;

        return { user: userObj as IUser, token };
    }

    /**
     * "Continue with Google": the frontend signs the user in with Firebase
     * (Google popup) and sends us the resulting Firebase ID token. We verify it
     * server-side, then find-or-create the matching MongoDB user by email and
     * issue our own normal JWT session — everything downstream (middleware,
     * cookies, roles) works exactly like a regular email/password login.
     */
    async googleLogin(data: GoogleLoginDTO): Promise<{ user: IUser; token: string }> {
        if (!firebaseAuth) {
            throw new HttpException(
                503,
                "Firebase Admin credentials are not configured. Configure Firebase Admin credentials to enable Google sign-in."
            );
        }

        let decoded;
        try {
            decoded = await firebaseAuth.verifyIdToken(data.idToken);
        } catch (err: any) {
            console.error("[firebase] verifyIdToken failed in googleLogin:", err.message);
            throw new HttpException(401, "Invalid or expired Google sign-in token");
        }

        const email = decoded.email;
        if (!email) {
            throw new HttpException(400, "Google account has no email address");
        }

        let user = await userRepository.getUserByEmail(email);

        if (!user) {
            const [firstName, ...rest] = (decoded.name || email.split("@")[0]).split(" ");
            const randomPassword = crypto.randomBytes(24).toString("hex");
            user = await userRepository.createUser({
                firstName: firstName || "Google",
                lastName: rest.join(" ") || "User",
                email,
                username: usernameFromEmail(email),
                password: await bcryptjs.hash(randomPassword, 10),
                profilePhoto: decoded.picture || undefined,
                role: "player",
                isVerified: true,
                firebaseUid: decoded.uid,
                authProvider: "google",
            } as Partial<IUser>);
        } else if (!user.isActive) {
            throw new HttpException(403, "Your account has been deactivated");
        } else if (!user.firebaseUid) {
            // Existing local account signing in with Google for the first time —
            // link it so future Google sign-ins resolve straight away.
            user = (await userRepository.update(user._id.toString(), { firebaseUid: decoded.uid } as Partial<IUser>)) as IUser;
        }

        const token = issueToken(user);
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        delete userObj.password;

        return { user: userObj as IUser, token };
    }

    async getProfile(userId: string): Promise<IUser> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        return user;
    }

    async updateProfile(userId: string, data: SelfUpdateProfileDTO): Promise<IUser> {
        const updated = await userRepository.update(userId, data as Partial<IUser>);
        if (!updated) {
            throw new HttpException(404, "User not found");
        }
        return updated;
    }

    async changePassword(userId: string, data: ChangePasswordDTO): Promise<{ success: boolean }> {
        const user = await userRepository.getUserByIdWithPassword(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const isPasswordValid = await bcryptjs.compare(data.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new HttpException(400, "Current password is incorrect");
        }

        const hashedPassword = await bcryptjs.hash(data.newPassword, 10);
        await userRepository.update(userId, { password: hashedPassword } as Partial<IUser>);

        return { success: true };
    }

    /**
     * Step 1 of the OTP-based forgot-password flow: generate a random 6-digit
     * code, store only its SHA-256 hash (never the plaintext) with a 10-minute
     * expiry, and email the plaintext code to the user via our own mailer.
     * Always returns the same generic message so we never reveal whether an
     * account exists for a given email.
     */
    async forgotPassword(data: ForgotPasswordDTO): Promise<{ message: string }> {
        const genericMessage = {
            message: "If an account with that email exists, a password reset code has been sent.",
        };

        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            return genericMessage;
        }

        const otp = crypto.randomInt(100000, 1000000).toString(); // 6 digits
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await userRepository.update(user._id.toString(), {
            resetOtpHash: otpHash,
            resetOtpExpires: expires,
        } as Partial<IUser>);

        try {
            await sendOtpEmail(user.email, otp);
        } catch (err: any) {
            console.warn(`[mailer] Failed to send OTP email to ${user.email}: ${err.message}`);
        }

        return genericMessage;
    }

    /**
     * Step 2: user submits the code they received plus a new password. We hash
     * the submitted code and compare it to what's stored, check it hasn't
     * expired, and if valid, update the password and clear the OTP fields so
     * it can't be reused.
     */
    async verifyResetOtp(data: VerifyResetOtpDTO): Promise<{ success: boolean }> {
        const user = await userRepository.getUserByEmailWithOtp(data.email);

        if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
            throw new HttpException(400, "Invalid or expired code");
        }

        if (user.resetOtpExpires.getTime() < Date.now()) {
            throw new HttpException(400, "This code has expired — request a new one");
        }

        const submittedHash = crypto.createHash("sha256").update(data.otp).digest("hex");
        if (submittedHash !== user.resetOtpHash) {
            throw new HttpException(400, "Invalid or expired code");
        }

        const hashedPassword = await bcryptjs.hash(data.newPassword, 10);
        await userRepository.update(user._id.toString(), {
            password: hashedPassword,
            resetOtpHash: null,
            resetOtpExpires: null,
        } as Partial<IUser>);

        return { success: true };
    }
}
