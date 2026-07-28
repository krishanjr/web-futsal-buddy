import { formatZodError } from "../utils/zod-error.util";
import { Request, Response } from "express";

import { ReportService } from "../services/report.service";
import { CreateReportDTO } from "../dtos/report.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { IUser } from "../models/user.model";

const reportService = new ReportService();

export class ReportController {
    async fileReport(req: Request, res: Response) {
        try {
            const reporterId = (req.user as IUser)._id.toString();
            const parsed = CreateReportDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const report = await reportService.fileReport(reporterId, parsed.data);
            return ApiResponseHelper.success(res, report, "Report submitted — our team will review it", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
