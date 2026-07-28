import mongoose, { Schema, Document } from "mongoose";
import { ReportType } from "../types/report.type";

export interface IReport extends ReportType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema: Schema = new Schema<IReport>(
    {
        reporterId: { type: String, required: true },
        reportedUserId: { type: String, required: true, index: true },
        reason: { type: String, required: true, maxlength: 500 },
        status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" },
    },
    { timestamps: true }
);

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);
