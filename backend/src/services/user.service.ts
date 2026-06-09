import { UserMongoRepository } from "../repositories/user.repository";
import { RegisterDTO, LoginDTO, UpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

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

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );

        // Remove password from response
        const userObj = user.toObject();
        delete (userObj as any).password;

        return { user: userObj as IUser, token };
    }

    async getProfile(userId: string): Promise<IUser> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        return user;
    }

    async updateProfile(userId: string, data: UpdateUserDTO): Promise<IUser> {
        const updated = await userRepository.update(userId, data as Partial<IUser>);
        if (!updated) {
            throw new HttpException(404, "User not found");
        }
        return updated;
    }
}
