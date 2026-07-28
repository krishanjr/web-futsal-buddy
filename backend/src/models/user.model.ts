import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    firebaseUid?: string | null;
    authProvider?: "local" | "google";
    resetOtpHash?: string | null;
    resetOtpExpires?: Date | null;
}

const UserMongoSchema: Schema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePhoto: { type: String, default: null },
        role: { type: String, enum: ["player", "organizer", "admin"], default: "player" },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        // Firebase UID for the matching Firebase Auth account. Every user gets one
        // (created eagerly on register, or lazily on first forgot-password request)
        // so that Google sign-in and Firebase's native password-reset email both work.
        firebaseUid: { type: String, default: null },
        // "google" = the account was first created via Google sign-in.
        // "local" = the account was created with our own email/password form.
        // Login (email + password) always checks MongoDB, regardless of this value.
        authProvider: { type: String, enum: ["local", "google"], default: "local" },
        // Password-reset OTP: we store a SHA-256 hash of the 6-digit code (never
        // the plaintext code itself) plus an expiry. Cleared after successful use.
        resetOtpHash: { type: String, default: null, select: false },
        resetOtpExpires: { type: Date, default: null, select: false },
    },
    { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);
