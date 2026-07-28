import { z } from "zod";

export const ReportSchema = z.object({
    reporterId: z.string().min(1),
    reportedUserId: z.string().min(1),
    reason: z.string().min(1).max(500),
    status: z.enum(["pending", "resolved", "dismissed"]).default("pending"),
});

export type ReportType = z.infer<typeof ReportSchema>;
