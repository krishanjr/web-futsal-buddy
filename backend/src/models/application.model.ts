import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    _id: mongoose.Types.ObjectId;
    postId: string;
    applicantId: string;
    applicantRole: "player" | "organizer";
    teamId?: string;
    message?: string;
    status: "pending" | "accepted" | "rejected" | "withdrawn";
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema<IApplication>(
    {
        postId: { type: String, required: true },
        applicantId: { type: String, required: true },
        applicantRole: { type: String, enum: ["player", "organizer"], required: true },
        teamId: { type: String },
        message: { type: String, maxlength: 500 },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "withdrawn"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const ApplicationModel = mongoose.model<IApplication>("Application", ApplicationSchema);
