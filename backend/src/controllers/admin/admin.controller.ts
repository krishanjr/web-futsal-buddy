import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { AdminService } from "../../services/admin.service";
import { UpdateUserDTO } from "../../dtos/user.dto";
import { SearchUserDTO, AdminCreateUserDTO, AdminListQueryDTO, SearchFutsalAdminDTO } from "../../dtos/admin.dto";
import { AdminBookingQueryDTO } from "../../dtos/booking.dto";
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

    // ─── Futsals ────────────────────────────────────────────────────────────
    async getAllFutsals(req: Request, res: Response) {
        try {
            const parsed = SearchFutsalAdminDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await adminService.getAllFutsals(parsed.data);
            return ApiResponseHelper.success(res, { futsals: result.futsals, pagination: result.pagination }, "All futsals fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getFutsalById(req: Request, res: Response) {
        try {
            const futsal = await adminService.getFutsalById(req.params.id);
            return ApiResponseHelper.success(res, futsal, "Futsal fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async verifyFutsal(req: Request, res: Response) {
        try {
            const futsal = await adminService.verifyFutsal(req.params.id);
            return ApiResponseHelper.success(res, futsal, "Futsal verified");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async unverifyFutsal(req: Request, res: Response) {
        try {
            const futsal = await adminService.unverifyFutsal(req.params.id);
            return ApiResponseHelper.success(res, futsal, "Futsal verification revoked");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteFutsal(req: Request, res: Response) {
        try {
            await adminService.deleteFutsal(req.params.id);
            return ApiResponseHelper.success(res, null, "Futsal deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Bookings ───────────────────────────────────────────────────────────
    async getAllBookings(req: Request, res: Response) {
        try {
            const parsed = AdminBookingQueryDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await adminService.getAllBookings(parsed.data);
            return ApiResponseHelper.success(res, { bookings: result.bookings, pagination: result.pagination }, "All bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteBooking(req: Request, res: Response) {
        try {
            await adminService.deleteBooking(req.params.id);
            return ApiResponseHelper.success(res, null, "Booking cancelled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Challenges ─────────────────────────────────────────────────────────
    async getAllChallenges(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 10;
            const result = await adminService.getAllChallenges(page, size);
            return ApiResponseHelper.success(res, { challenges: result.challenges, pagination: result.pagination }, "All challenges fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Organizer verification ────────────────────────────────────────────
    async verifyOrganizerAccount(req: Request, res: Response) {
        try {
            const user = await adminService.verifyOrganizerAccount(req.params.id);
            return ApiResponseHelper.success(res, user, "Organizer account verified");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Reports ────────────────────────────────────────────────────────────
    async getAllReports(req: Request, res: Response) {
        try {
            const status = typeof req.query.status === "string" ? req.query.status : undefined;
            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 10;
            const result = await adminService.getAllReports(status, page, size);
            return ApiResponseHelper.success(res, { reports: result.reports, pagination: result.pagination }, "Reports fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async resolveReport(req: Request, res: Response) {
        try {
            const status = req.body.status === "dismissed" ? "dismissed" : "resolved";
            const report = await adminService.resolveReport(req.params.id, status);
            return ApiResponseHelper.success(res, report, `Report marked ${status}`);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Analytics ──────────────────────────────────────────────────────────
    async getAnalytics(req: Request, res: Response) {
        try {
            const analytics = await adminService.getAnalytics();
            return ApiResponseHelper.success(res, analytics, "Analytics fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
