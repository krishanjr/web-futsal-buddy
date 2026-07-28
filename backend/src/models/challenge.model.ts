import mongoose, { Schema, Document } from "mongoose";
import { ChallengeType } from "../types/challenge.type";

export interface IChallenge extends ChallengeType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema<IChallenge>(
    {
        challengerTeamId: { type: String, required: true, index: true },
        challengerPlayerId: { type: String, required: true },
        opponentTeamId: { type: String, required: true, index: true },
        proposedDate: { type: String, required: true },
        proposedTime: { type: String, required: true },
        preferredFutsalId: { type: String },
        message: { type: String, maxlength: 500 },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "countered", "withdrawn"],
            default: "pending",
        },
        counterDate: { type: String },
        counterTime: { type: String },
        counterFutsalId: { type: String },
    },
    { timestamps: true }
);

export const ChallengeModel = mongoose.model<IChallenge>("Challenge", ChallengeSchema);
