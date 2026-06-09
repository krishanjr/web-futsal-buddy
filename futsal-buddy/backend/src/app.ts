import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";

// Routes
import userRoutes from "./routes/user.route";
import playerRoutes from "./routes/player/player.route";
import matchRoutes from "./routes/organizer/match.route";
import teamRoutes from "./routes/organizer/team.route";
import adminRoutes from "./routes/admin/admin.route";
import aiRoutes from "./routes/ai.route";

const app: Application = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"], // your frontend origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
    return res.json({
        success: true,
        message: "⚽ Futsal Buddy API is running!",
        version: "1.0.0",
        docs: "See Postman collection for full API documentation",
    });
});

app.get("/api/v1/health", (_req: Request, res: Response) => {
    return res.json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
// Auth (register/login for all roles)
app.use("/api/v1/auth", userRoutes);

// Player routes (profile, search teammates/opponents)
app.use("/api/v1/players", playerRoutes);

// Organizer routes (matches)
app.use("/api/v1/matches", matchRoutes);

// Organizer routes (teams)
app.use("/api/v1/teams", teamRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

// AI Insights routes
app.use("/api/v1/ai", aiRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
    return res.status(404).json({
        status: 404,
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        data: null,
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error:", err);
    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }
    return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

export default app;
