import mongoose, { Schema, Document } from "mongoose";
import { BookingType } from "../types/booking.type";

export interface IBooking extends BookingType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
    {
        futsalId: { type: String, required: true, index: true },
        playerId: { type: String, required: true, index: true },
        date: { type: String, required: true, index: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled", "completed"],
            default: "pending",
        },
        challengeId: { type: String },
        price: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
