import mongoose, { Schema, Document } from "mongoose";
import { PlayerProfileType } from "../types/player.type";

export interface IPlayerProfile extends PlayerProfileType, Document {
    _id: mongoose.Types.ObjectId;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PlayerProfileSchema: Schema = new Schema<IPlayerProfile>(
    {
        userId: { type: String, required: true, index: true },
        position: { type: String, enum: ["forward", "midfielder", "defender", "goalkeeper", "any"], required: true },
        skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced", "professional"], required: true },
        preferredFoot: { type: String, enum: ["right", "left"], default: "right" },
        age: { type: Number, min: 13, max: 60 },
        city: { type: String, required: true },
        bio: { type: String, maxlength: 500 },
        availability: { type: [String], default: [] },
        stats: {
            matchesPlayed: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            goals: { type: Number, default: 0 },
            assists: { type: Number, default: 0 },
        },
        lookingFor: { type: String, enum: ["both", "teammate", "opponent"], default: "both" },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const PlayerProfileModel = mongoose.model<IPlayerProfile>("PlayerProfile", PlayerProfileSchema);