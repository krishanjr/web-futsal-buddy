import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { PlayerService } from "../services/player.service";
import { IUser } from "../models/user.model";

const aiService = new AIService();
const playerService = new PlayerService();

export class AIController {
    async getMyInsights(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const profile = await playerService.getMyProfile(userId);

            const result = await aiService.getPlayerInsights({
                position: profile.position,
                skillLevel: profile.skillLevel,
                stats: profile.stats,
                city: profile.city,
                lookingFor: profile.lookingFor,
            });

            return ApiResponseHelper.success(res, result, "AI insights generated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMatchTip(req: Request, res: Response) {
        try {
            const { skillLevel = "any", matchType = "friendly", playersCount = 10 } = req.body;
            const result = await aiService.getMatchTips({ skillLevel, matchType, playersCount: Number(playersCount) });
            return ApiResponseHelper.success(res, result, "Match tip generated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getTeamAdvice(req: Request, res: Response) {
        try {
            const { skillLevel = "mixed", memberCount = 5, maxMembers = 10 } = req.body;
            const result = await aiService.getTeamAdvice({
                skillLevel,
                memberCount: Number(memberCount),
                maxMembers: Number(maxMembers),
            });
            return ApiResponseHelper.success(res, result, "Team advice generated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async askQuestion(req: Request, res: Response) {
        try {
            const { question } = req.body;
            const result = await aiService.getGeneralInsight(question);
            return ApiResponseHelper.success(res, result, "AI answer generated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
