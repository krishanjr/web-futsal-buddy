import mongoose, { Schema, Document } from "mongoose";
import { TeamType } from "../types/team.type";

export interface ITeam extends TeamType, Document {
    _id: mongoose.Types.ObjectId;
    members: string[]; // array of userId strings
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema: Schema = new Schema<ITeam>(
    {
        name: { type: String, required: true },
        organizerId: { type: String, required: true },
        city: { type: String, required: true },
        description: { type: String, maxlength: 500 },
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "mixed"],
            default: "mixed",
        },
        maxMembers: { type: Number, default: 10 },
        isOpen: { type: Boolean, default: true },
        logoUrl: { type: String },
        members: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const TeamModel = mongoose.model<ITeam>("Team", TeamSchema);
