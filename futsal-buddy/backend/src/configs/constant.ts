import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 5000;
export const MONGODB_URL: string =
    process.env.MONGODB_URL || "mongodb://localhost:27017/futsal-buddy-db";
export const SECRET_KEY: string =
    process.env.SECRET_KEY || "futsalBuddySecretKey2024!";
export const GEMINI_API_KEY: string =
    process.env.GEMINI_API_KEY || "";
