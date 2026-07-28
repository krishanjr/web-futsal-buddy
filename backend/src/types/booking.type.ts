import { z } from "zod";

export const BookingSchema = z.object({
    futsalId: z.string().min(1, "Futsal is required"),
    playerId: z.string().min(1, "Player is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    status: z
        .enum(["pending", "approved", "rejected", "cancelled", "completed"])
        .default("pending"),
    challengeId: z.string().optional(),
    price: z.number().min(0).default(0),
});

export type BookingType = z.infer<typeof BookingSchema>;
