import { Request, Response } from "express";
import { NotificationMongoRepository } from "../repositories/notification.repository";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { IUser } from "../models/user.model";

const notificationRepository = new NotificationMongoRepository();

export class NotificationController {
    async getMyNotifications(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const [notifications, unreadCount] = await Promise.all([
                notificationRepository.findByUser(userId),
                notificationRepository.countUnread(userId),
            ]);
            return ApiResponseHelper.success(res, { notifications, unreadCount }, "Notifications fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async markRead(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            const notification = await notificationRepository.markRead(req.params.id, userId);
            return ApiResponseHelper.success(res, notification, "Marked as read");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async markAllRead(req: Request, res: Response) {
        try {
            const userId = (req.user as IUser)._id.toString();
            await notificationRepository.markAllRead(userId);
            return ApiResponseHelper.success(res, null, "All notifications marked as read");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
