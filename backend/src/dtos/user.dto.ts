import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const RegisterDTO = UserSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
    password: true,
}).extend({
    // Public registration may only ever create a player or organizer account.
    // Admin accounts are never created through this endpoint.
    role: z.enum(["player", "organizer"]).default("player"),
});
export type RegisterDTO = z.infer<typeof RegisterDTO>;

export const LoginDTO = UserSchema.pick({
    email: true,
    password: true,
});
export type LoginDTO = z.infer<typeof LoginDTO>;

export const UpdateUserDTO = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    profilePhoto: z.string().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(["player", "organizer", "admin"]).optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

// Used ONLY for the self-service "update my own profile" endpoint.
// Deliberately excludes `role` and `isActive` — a user must never be able to
// grant themselves admin or reactivate their own deactivated account by
// including those fields in a normal profile update request.
export const SelfUpdateProfileDTO = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    profilePhoto: z.string().optional(),
});
export type SelfUpdateProfileDTO = z.infer<typeof SelfUpdateProfileDTO>;

export const ChangePasswordDTO = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTO>;

export const ForgotPasswordDTO = z.object({
    email: z.string().email("Invalid email address"),
});
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;

// Firebase-based auth additions -------------------------------------------------

// Google sign-in: the frontend authenticates with Firebase (Google popup) and
// sends us the resulting Firebase ID token, which we verify server-side.
export const GoogleLoginDTO = z.object({
    idToken: z.string().min(1, "Firebase ID token is required"),
});
export type GoogleLoginDTO = z.infer<typeof GoogleLoginDTO>;

// After the user receives the 6-digit code by email (see forgotPassword), they
// submit it here along with the new password. Backend checks it against the
// hashed code + expiry stored on the user record.
export const VerifyResetOtpDTO = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "Code must be 6 digits"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export type VerifyResetOtpDTO = z.infer<typeof VerifyResetOtpDTO>;
