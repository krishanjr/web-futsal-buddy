import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { AdminService } from "../../services/admin.service";
import { UpdateUserDTO } from "../../dtos/user.dto";
import { SearchUserDTO, AdminCreateUserDTO, AdminListQueryDTO } from "../../dtos/admin.dto";
import { CreateTeamDTO, UpdateTeamDTO } from "../../dtos/team.dto";
import { CreateMatchDTO, UpdateMatchDTO } from "../../dtos/match.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

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

    // ─── Users ──────────────────────────────────────────────────────────────
    async getAllUsers(req: Request, res: Response) {
        try {
            const parsed = SearchUserDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await adminService.getAllUsers(parsed.data);
            return ApiResponseHelper.success(res, { users: result.users, pagination: result.pagination }, "All users fetched");
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

    async createUser(req: Request, res: Response) {
        try {
            const parsed = AdminCreateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const user = await adminService.createUser(parsed.data);
            return ApiResponseHelper.success(res, user, "User created successfully", 201);
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

    // ─── Teams ──────────────────────────────────────────────────────────────
    async getAllTeams(req: Request, res: Response) {
        try {
            const parsed = AdminListQueryDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await adminService.getAllTeams(parsed.data);
            return ApiResponseHelper.success(res, { teams: result.teams, pagination: result.pagination }, "All teams fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getTeamById(req: Request, res: Response) {
        try {
            const team = await adminService.getTeamById(req.params.id);
            return ApiResponseHelper.success(res, team, "Team fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async createTeam(req: Request, res: Response) {
        try {
            const parsed = CreateTeamDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const adminId = (req.user as IUser)._id.toString();
            const team = await adminService.createTeam(adminId, { ...parsed.data, organizerId: req.body.organizerId });
            return ApiResponseHelper.success(res, team, "Team created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateTeam(req: Request, res: Response) {
        try {
            const parsed = UpdateTeamDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const team = await adminService.updateTeam(req.params.id, parsed.data);
            return ApiResponseHelper.success(res, team, "Team updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteTeam(req: Request, res: Response) {
        try {
            await adminService.deleteTeam(req.params.id);
            return ApiResponseHelper.success(res, null, "Team deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Matches ────────────────────────────────────────────────────────────
    async getAllMatches(req: Request, res: Response) {
        try {
            const parsed = AdminListQueryDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await adminService.getAllMatches(parsed.data);
            return ApiResponseHelper.success(res, { matches: result.matches, pagination: result.pagination }, "All matches fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMatchById(req: Request, res: Response) {
        try {
            const match = await adminService.getMatchById(req.params.id);
            return ApiResponseHelper.success(res, match, "Match fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async createMatch(req: Request, res: Response) {
        try {
            const parsed = CreateMatchDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const adminId = (req.user as IUser)._id.toString();
            const match = await adminService.createMatch(adminId, { ...parsed.data, organizerId: req.body.organizerId });
            return ApiResponseHelper.success(res, match, "Match created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateMatch(req: Request, res: Response) {
        try {
            const parsed = UpdateMatchDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const match = await adminService.updateMatch(req.params.id, parsed.data);
            return ApiResponseHelper.success(res, match, "Match updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteMatch(req: Request, res: Response) {
        try {
            await adminService.deleteMatch(req.params.id);
            return ApiResponseHelper.success(res, null, "Match deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
