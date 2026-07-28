import { formatZodError } from "../utils/zod-error.util";
import { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { RegisterDTO, LoginDTO, UpdateUserDTO, SelfUpdateProfileDTO, ChangePasswordDTO, ForgotPasswordDTO, GoogleLoginDTO, VerifyResetOtpDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { IUser } from "../models/user.model";

const userService = new UserService();

export class UserController {
    async register(req: Request, res: Response) {
        try {
            const parsed = RegisterDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const user = await userService.register(parsed.data);
            const userObj = (user as any).toObject ? (user as any).toObject() : user;
            delete userObj.password;
            return ApiResponseHelper.success(res, userObj, "Account created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsed = LoginDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const { user, token } = await userService.login(parsed.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const user = await userService.getProfile(userId);
            return ApiResponseHelper.success(res, user, "Profile fetched successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const parsed = SelfUpdateProfileDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const updated = await userService.updateProfile(userId, parsed.data);
            return ApiResponseHelper.success(res, updated, "Profile updated successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const parsed = ChangePasswordDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await userService.changePassword(userId, parsed.data);
            return ApiResponseHelper.success(res, result, "Password changed successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const parsed = ForgotPasswordDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await userService.forgotPassword(parsed.data);
            return ApiResponseHelper.success(res, result, result.message);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async googleLogin(req: Request, res: Response) {
        try {
            const parsed = GoogleLoginDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const { user, token } = await userService.googleLogin(parsed.data);
            return ApiResponseHelper.success(res, { user, token }, "Login successful");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async verifyResetOtp(req: Request, res: Response) {
        try {
            const parsed = VerifyResetOtpDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await userService.verifyResetOtp(parsed.data);
            return ApiResponseHelper.success(res, result, "Password reset successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
