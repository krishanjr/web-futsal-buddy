import { NotificationModel, INotification } from "../models/notification.model";

export class NotificationMongoRepository {
    async create(data: Partial<INotification>): Promise<INotification> {
        return await NotificationModel.create(data);
    }

    async findByUser(userId: string): Promise<INotification[]> {
        return await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(100);
    }

    async countUnread(userId: string): Promise<number> {
        return await NotificationModel.countDocuments({ userId, isRead: false });
    }

    async markRead(id: string, userId: string): Promise<INotification | null> {
        return await NotificationModel.findOneAndUpdate({ _id: id, userId }, { isRead: true }, { new: true });
    }

    async markAllRead(userId: string): Promise<void> {
        await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
    }
}

/**
 * Thin helper used by other services to fire-and-forget a notification.
 * Never throws — a notification failure should never break the calling action.
 */
export class NotifyService {
    private static repo = new NotificationMongoRepository();

    static async send(userId: string, type: string, message: string, relatedId?: string) {
        try {
            await NotifyService.repo.create({ userId, type: type as any, message, relatedId });
        } catch {
            // Notifications are best-effort — swallow errors intentionally.
        }
    }
}
