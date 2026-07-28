import { formatZodError } from "../utils/zod-error.util";
import { Request, Response } from "express";

import { ReviewService } from "../services/review.service";
import { CreateReviewDTO } from "../dtos/review.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { IUser } from "../models/user.model";

const reviewService = new ReviewService();

export class ReviewController {
    async createReview(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const parsed = CreateReviewDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const review = await reviewService.createReview(playerId, parsed.data);
            return ApiResponseHelper.success(res, review, "Review submitted", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getFutsalReviews(req: Request, res: Response) {
        try {
            const reviews = await reviewService.getFutsalReviews(req.params.futsalId);
            return ApiResponseHelper.success(res, reviews, "Reviews fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
