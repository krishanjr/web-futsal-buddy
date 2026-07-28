import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";

// Routes
import userRoutes from "./routes/user.route";
import playerRoutes from "./routes/player/player.route";
import matchRoutes from "./routes/organizer/match.route";
import teamRoutes from "./routes/organizer/team.route";
import futsalRoutes from "./routes/organizer/futsal.route";
import bookingRoutes from "./routes/organizer/booking.route";
import challengeRoutes from "./routes/player/challenge.route";
import notificationRoutes from "./routes/notification.route";
import reviewRoutes from "./routes/review.route";
import reportRoutes from "./routes/report.route";
import adminRoutes from "./routes/admin/admin.route";
import postRoutes from "./routes/post.route";
import aiRoutes from "./routes/ai.route";
import uploadRoutes from "./routes/upload.route";

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

// Futsal venues (organizer manages, players browse)
app.use("/api/v1/futsals", futsalRoutes);

// Bookings (player books, organizer approves/rejects)
app.use("/api/v1/bookings", bookingRoutes);

// Challenges (team vs team opponent matchmaking)
app.use("/api/v1/challenges", challengeRoutes);

// Notifications
app.use("/api/v1/notifications", notificationRoutes);

// Reviews
app.use("/api/v1/reviews", reviewRoutes);

// Reports (user moderation)
app.use("/api/v1/reports", reportRoutes);

// Admin routes
app.use("/api/v1/admin", adminRoutes);

// AI Insights routes
app.use("/api/v1/ai", aiRoutes);

// Post + Application marketplace (find teammate / find opponent)
app.use("/api/v1/posts", postRoutes);

// Upload routes
app.use("/api/v1/upload", uploadRoutes);

// Serve static files
app.use("/uploads", express.static("uploads"));

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
