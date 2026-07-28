import mongoose, { Schema, Document } from "mongoose";
import { NotificationType } from "../types/notification.type";

export interface INotification extends NotificationType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema<INotification>(
    {
        userId: { type: String, required: true, index: true },
        type: { type: String, required: true },
        message: { type: String, required: true },
        relatedId: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
