import { z } from "zod";

export const CreateBookingDTO = z.object({
    futsalId: z.string().min(1, "Futsal is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    challengeId: z.string().optional(),
});
export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

export const OrganizerBookingQueryDTO = z.object({
    futsalId: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected", "cancelled", "completed"]).optional(),
    range: z.enum(["today", "week", "month", "all"]).default("all"),
});
export type OrganizerBookingQueryDTO = z.infer<typeof OrganizerBookingQueryDTO>;

export const AdminBookingQueryDTO = z.object({
    status: z.enum(["pending", "approved", "rejected", "cancelled", "completed"]).optional(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(100).default(10),
});
export type AdminBookingQueryDTO = z.infer<typeof AdminBookingQueryDTO>;
