import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { TeamService } from "../../services/team.service";
import { CreateTeamDTO, UpdateTeamDTO, SearchTeamDTO } from "../../dtos/team.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const teamService = new TeamService();

export class TeamController {
    async createTeam(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = CreateTeamDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const team = await teamService.createTeam(organizerId, parsed.data);
            return ApiResponseHelper.success(res, team, "Team created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getTeamById(req: Request, res: Response) {
        try {
            const team = await teamService.getTeamById(req.params.id);
            return ApiResponseHelper.success(res, team, "Team fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyTeams(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const teams = await teamService.getMyTeams(organizerId);
            return ApiResponseHelper.success(res, teams, "Teams fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateTeam(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = UpdateTeamDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const team = await teamService.updateTeam(organizerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, team, "Team updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteTeam(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            await teamService.deleteTeam(organizerId, req.params.id);
            return ApiResponseHelper.success(res, null, "Team deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchTeams(req: Request, res: Response) {
        try {
            const parsed = SearchTeamDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await teamService.searchTeams(parsed.data);
            return ApiResponseHelper.success(res, result.teams, "Teams fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async joinTeam(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const team = await teamService.joinTeam(req.params.id, userId);
            return ApiResponseHelper.success(res, team, "Joined team successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async leaveTeam(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const team = await teamService.leaveTeam(req.params.id, userId);
            return ApiResponseHelper.success(res, team, "Left team successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
