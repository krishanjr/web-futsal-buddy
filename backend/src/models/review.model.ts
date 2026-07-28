import mongoose, { Schema, Document } from "mongoose";
import { ReviewType } from "../types/review.type";

export interface IReview extends ReviewType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema<IReview>(
    {
        futsalId: { type: String, required: true, index: true },
        playerId: { type: String, required: true },
        bookingId: { type: String, required: true, unique: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
    },
    { timestamps: true }
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
