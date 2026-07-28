import { z } from "zod";

export const CreateReportDTO = z.object({
    reportedUsername: z.string().min(1, "Username is required"),
    reason: z.string().min(1, "Reason is required").max(500),
});
export type CreateReportDTO = z.infer<typeof CreateReportDTO>;
