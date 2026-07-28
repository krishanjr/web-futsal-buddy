import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { MatchService } from "../../services/match.service";
import { CreateMatchDTO, UpdateMatchDTO, SearchMatchDTO } from "../../dtos/match.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const matchService = new MatchService();

export class MatchController {
    async createMatch(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = CreateMatchDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const match = await matchService.createMatch(organizerId, parsed.data);
            return ApiResponseHelper.success(res, match, "Match created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMatchById(req: Request, res: Response) {
        try {
            const match = await matchService.getMatchById(req.params.id);
            return ApiResponseHelper.success(res, match, "Match fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyMatches(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const matches = await matchService.getMyMatches(organizerId);
            return ApiResponseHelper.success(res, matches, "Matches fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateMatch(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = UpdateMatchDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const match = await matchService.updateMatch(organizerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, match, "Match updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteMatch(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            await matchService.deleteMatch(organizerId, req.params.id);
            return ApiResponseHelper.success(res, null, "Match deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchMatches(req: Request, res: Response) {
        try {
            const parsed = SearchMatchDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await matchService.searchMatches(parsed.data);
            return ApiResponseHelper.success(res, result.matches, "Matches fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async joinMatch(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const match = await matchService.joinMatch(req.params.id, userId);
            return ApiResponseHelper.success(res, match, "Joined match successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async leaveMatch(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const match = await matchService.leaveMatch(req.params.id, userId);
            return ApiResponseHelper.success(res, match, "Left match successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
