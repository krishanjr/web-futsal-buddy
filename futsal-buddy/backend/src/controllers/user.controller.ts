import { formatZodError } from "../utils/zod-error.util";
import { Request, Response } from "express";

import { UserService } from "../services/user.service";
import { RegisterDTO, LoginDTO, UpdateUserDTO } from "../dtos/user.dto";
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
            const parsed = UpdateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const updated = await userService.updateProfile(userId, parsed.data);
            return ApiResponseHelper.success(res, updated, "Profile updated successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
