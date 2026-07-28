import mongoose, { Schema, Document } from "mongoose";
import { TeamType } from "../types/team.type";

export interface ITeam extends TeamType, Document {
    _id: mongoose.Types.ObjectId;
    members: string[];
    createdAt: Date;
    updatedAt: Date;
}

const TeamMongoSchema: Schema = new Schema<ITeam>(
    {
        name: { type: String, required: true },
        organizerId: { type: String, required: true },
        city: { type: String, required: true },
        description: { type: String, maxlength: 1000 },
        skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced", "mixed"], default: "beginner" },
        maxMembers: { type: Number, min: 2, max: 20, default: 10 },
        isOpen: { type: Boolean, default: true },
        members: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const TeamModel = mongoose.model<ITeam>("Team", TeamMongoSchema);