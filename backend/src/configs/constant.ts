import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 5000;
export const MONGODB_URL: string =
    process.env.MONGODB_URL || "mongodb://localhost:27017/futsal-buddy-db";
export const SECRET_KEY: string =
    process.env.SECRET_KEY || "futsalBuddySecretKey2024!";
export const GEMINI_API_KEY: string =
    process.env.GEMINI_API_KEY || "";
export const FRONTEND_URL: string =
    process.env.FRONTEND_URL || "http://localhost:3000";

// Firebase Admin credentials (Firebase Console > Project Settings > Service accounts
// > Generate new private key). Used for verifying Google sign-in tokens and for
// syncing Firebase-driven password resets back into our own MongoDB.
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID || "";
export const FIREBASE_CLIENT_EMAIL: string = process.env.FIREBASE_CLIENT_EMAIL || "";
export const FIREBASE_PRIVATE_KEY: string = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

// Email (for the forgot-password OTP code). Using Gmail SMTP with an "App
// Password" is the easiest way to get this working — see backend/.env for
// setup instructions.
export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const EMAIL_PASS: string = process.env.EMAIL_PASS || "";
export const EMAIL_FROM: string = process.env.EMAIL_FROM || EMAIL_USER;
