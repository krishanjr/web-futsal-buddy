import mongoose, { Schema, Document } from "mongoose";
import { FutsalType } from "../types/futsal.type";

export interface IFutsal extends FutsalType, Document {
    _id: mongoose.Types.ObjectId;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const FutsalSchema: Schema = new Schema<IFutsal>(
    {
        organizerId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        description: { type: String, maxlength: 1000 },
        district: { type: String, required: true },
        municipality: { type: String },
        nearbyLandmark: { type: String },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        contactNumber: { type: String, required: true },
        pricePerHour: { type: Number, required: true, min: 0 },
        openingTime: { type: String, required: true },
        closingTime: { type: String, required: true },
        facilities: { type: [String], default: [] },
        images: { type: [String], default: [] },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        holidays: { type: [String], default: [] },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const FutsalModel = mongoose.model<IFutsal>("Futsal", FutsalSchema);
