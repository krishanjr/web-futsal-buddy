import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { ChallengeService } from "../../services/challenge.service";
import { CreateChallengeDTO, CounterChallengeDTO } from "../../dtos/challenge.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const challengeService = new ChallengeService();

export class ChallengeController {
    async sendChallenge(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const parsed = CreateChallengeDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const challenge = await challengeService.sendChallenge(playerId, parsed.data);
            return ApiResponseHelper.success(res, challenge, "Challenge sent", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyChallenges(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const result = await challengeService.getMyChallenges(playerId);
            return ApiResponseHelper.success(res, result, "Challenges fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async acceptChallenge(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const challenge = await challengeService.acceptChallenge(playerId, req.params.id);
            return ApiResponseHelper.success(res, challenge, "Challenge accepted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async rejectChallenge(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const challenge = await challengeService.rejectChallenge(playerId, req.params.id);
            return ApiResponseHelper.success(res, challenge, "Challenge rejected");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async counterChallenge(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const parsed = CounterChallengeDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const challenge = await challengeService.counterChallenge(playerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, challenge, "Counter offer sent");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async withdrawChallenge(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const challenge = await challengeService.withdrawChallenge(playerId, req.params.id);
            return ApiResponseHelper.success(res, challenge, "Challenge withdrawn");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
