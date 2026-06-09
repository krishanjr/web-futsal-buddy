import mongoose, { Schema, Document } from "mongoose";
import { PlayerProfileType } from "../types/player.type";

export interface IPlayerProfile extends PlayerProfileType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PlayerProfileSchema: Schema = new Schema<IPlayerProfile>(
    {
        userId: { type: String, required: true, unique: true },
        position: {
            type: String,
            enum: ["goalkeeper", "defender", "midfielder", "forward", "any"],
            default: "any",
        },
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "professional"],
            default: "beginner",
        },
        preferredFoot: { type: String, enum: ["left", "right", "both"], default: "right" },
        age: { type: Number, required: true },
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
        lookingFor: { type: String, enum: ["teammate", "opponent", "both"], default: "both" },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const PlayerProfileModel = mongoose.model<IPlayerProfile>("PlayerProfile", PlayerProfileSchema);
