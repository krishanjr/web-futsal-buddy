import mongoose, { Schema, Document } from "mongoose";
import { MatchType } from "../types/match.type";

export interface IMatch extends MatchType, Document {
    _id: mongoose.Types.ObjectId;
    players: string[]; // array of userId strings who joined
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema: Schema = new Schema<IMatch>(
    {
        title: { type: String, required: true },
        organizerId: { type: String, required: true },
        venue: { type: String, required: true },
        city: { type: String, required: true },
        matchDate: { type: String, required: true },
        matchTime: { type: String, required: true },
        maxPlayers: { type: Number, default: 10 },
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "any"],
            default: "any",
        },
        matchType: {
            type: String,
            enum: ["friendly", "competitive", "tournament"],
            default: "friendly",
        },
        description: { type: String, maxlength: 1000 },
        status: {
            type: String,
            enum: ["open", "full", "ongoing", "completed", "cancelled"],
            default: "open",
        },
        entryFee: { type: Number, default: 0 },
        players: { type: [String], default: [] }, // userId list
    },
    { timestamps: true }
);

export const MatchModel = mongoose.model<IMatch>("Match", MatchSchema);
