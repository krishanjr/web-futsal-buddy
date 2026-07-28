import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { FutsalService } from "../../services/futsal.service";
import {
    CreateFutsalDTO,
    UpdateFutsalDTO,
    SearchFutsalDTO,
    SetHolidaysDTO,
    AddFutsalImagesDTO,
} from "../../dtos/futsal.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const futsalService = new FutsalService();

export class FutsalController {
    // ─── Organizer ──────────────────────────────────────────────────────────

    async createFutsal(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = CreateFutsalDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const futsal = await futsalService.createFutsal(organizerId, parsed.data);
            return ApiResponseHelper.success(res, futsal, "Futsal profile created successfully", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyFutsals(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const futsals = await futsalService.getMyFutsals(organizerId);
            return ApiResponseHelper.success(res, futsals, "Futsals fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async updateFutsal(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = UpdateFutsalDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const futsal = await futsalService.updateFutsal(organizerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, futsal, "Futsal updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async deleteFutsal(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            await futsalService.deleteFutsal(organizerId, req.params.id);
            return ApiResponseHelper.success(res, null, "Futsal deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async addImages(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = AddFutsalImagesDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const futsal = await futsalService.addImages(organizerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, futsal, "Images added");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async removeImage(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const { imageUrl } = req.body;
            if (!imageUrl) return ApiResponseHelper.error(res, "imageUrl is required", 400);
            const futsal = await futsalService.removeImage(organizerId, req.params.id, imageUrl);
            return ApiResponseHelper.success(res, futsal, "Image removed");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async setHolidays(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = SetHolidaysDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const futsal = await futsalService.setHolidays(organizerId, req.params.id, parsed.data);
            return ApiResponseHelper.success(res, futsal, "Holidays updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Public / Player (any logged-in user) ──────────────────────────────

    async searchFutsals(req: Request, res: Response) {
        try {
            const parsed = SearchFutsalDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await futsalService.searchFutsals(parsed.data);
            return ApiResponseHelper.success(res, result.futsals, "Futsals fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getFutsalById(req: Request, res: Response) {
        try {
            const futsal = await futsalService.getFutsalById(req.params.id);
            return ApiResponseHelper.success(res, futsal, "Futsal fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
