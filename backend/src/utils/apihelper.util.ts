import { Response } from "express";

export class ApiResponseHelper {
    static success(res: Response, data: any, message: string, statusCode: number = 200, meta?: any) {
        const response: any = {
            success: true,
            message,
            data,
        };
        if (meta) {
            response.meta = meta;
        }
        return res.status(statusCode).json(response);
    }

    static error(res: Response, message: string, statusCode: number = 500) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}