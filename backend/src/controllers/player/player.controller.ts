import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { PlayerService } from "../../services/player.service";
import { CreatePlayerProfileDTO, UpdatePlayerProfileDTO, SearchPlayerDTO } from "../../dtos/player.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const playerService = new PlayerService();

export class PlayerController {
    async createProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const parsed = CreatePlayerProfileDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const profile = await playerService.createProfile(userId, parsed.data);
            return ApiResponseHelper.success(res, profile, "Player profile created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const profile = await playerService.getMyProfile(userId);
            return ApiResponseHelper.success(res, profile, "Player profile fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getProfileById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const profile = await playerService.getProfileById(id);
            return ApiResponseHelper.success(res, profile, "Player profile fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const parsed = UpdatePlayerProfileDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const profile = await playerService.updateProfile(userId, parsed.data);
            return ApiResponseHelper.success(res, profile, "Player profile updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteProfile(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            await playerService.deleteProfile(userId);
            return ApiResponseHelper.success(res, null, "Player profile deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchPlayers(req: Request, res: Response) {
        try {
            const parsed = SearchPlayerDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await playerService.searchPlayers(parsed.data);
            return ApiResponseHelper.success(res, result.players, "Players fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchTeammates(req: Request, res: Response) {
        try {
            const parsed = SearchPlayerDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await playerService.searchTeammates(parsed.data);
            return ApiResponseHelper.success(res, result.players, "Teammates fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchOpponents(req: Request, res: Response) {
        try {
            const parsed = SearchPlayerDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await playerService.searchOpponents(parsed.data);
            return ApiResponseHelper.success(res, result.players, "Opponents fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
