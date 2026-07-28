import { Request, Response, NextFunction } from 'express';
import { ApiResponseHelper } from '../utils/apihelper.util';
import fs from 'fs';
import path from 'path';

export class UploadController {
    static uploadFile = (req: Request, res: Response, _next: NextFunction) => {
        try {
            if (!req.file) {
                return ApiResponseHelper.error(res, 'No file uploaded', 400);
            }

            const fileUrl = `/uploads/${req.file.filename}`;
            
            return ApiResponseHelper.success(
                res,
                {
                    filename: req.file.filename,
                    url: fileUrl,
                    size: req.file.size,
                },
                'File uploaded successfully',
                201
            );
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message, 500);
        }
    };

    static deleteFile = (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { filename } = req.params;
            
            if (!filename) {
                return ApiResponseHelper.error(res, 'Filename is required', 400);
            }

            const filePath = path.join(__dirname, '../../uploads', filename);
            const uploadsDir = path.join(__dirname, '../../uploads');

            // Security check
            if (!filePath.startsWith(uploadsDir)) {
                return ApiResponseHelper.error(res, 'Invalid file path', 400);
            }

            if (!fs.existsSync(filePath)) {
                return ApiResponseHelper.error(res, 'File not found', 404);
            }

            fs.unlinkSync(filePath);

            return ApiResponseHelper.success(res, null, 'File deleted successfully');
        } catch (error: any) {
            return ApiResponseHelper.error(res, error.message, 500);
        }
    };
}
