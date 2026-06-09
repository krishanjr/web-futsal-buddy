import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { AdminService } from "../../services/admin.service";
import { UpdateUserDTO } from "../../dtos/user.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminService = new AdminService();

export class AdminController {
    async getDashboard(req: Request, res: Response) {
        try {
            const stats = await adminService.getDashboardStats();
            return ApiResponseHelper.success(res, stats, "Dashboard stats fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await adminService.getAllUsers();
            return ApiResponseHelper.success(res, users, "All users fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await adminService.getUserById(req.params.id);
            return ApiResponseHelper.success(res, user, "User fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const parsed = UpdateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const user = await adminService.updateUser(req.params.id, parsed.data);
            return ApiResponseHelper.success(res, user, "User updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            await adminService.deleteUser(req.params.id);
            return ApiResponseHelper.success(res, null, "User deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deactivateUser(req: Request, res: Response) {
        try {
            const user = await adminService.deactivateUser(req.params.id);
            return ApiResponseHelper.success(res, user, "User deactivated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async activateUser(req: Request, res: Response) {
        try {
            const user = await adminService.activateUser(req.params.id);
            return ApiResponseHelper.success(res, user, "User activated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
