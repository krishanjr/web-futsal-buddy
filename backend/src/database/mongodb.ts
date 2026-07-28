import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";

let isConnected: boolean = false;

export async function connectToMongoDB(): Promise<void> {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(MONGODB_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error: any) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
}