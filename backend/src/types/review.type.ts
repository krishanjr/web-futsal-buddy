import { z } from "zod";

export const ReviewSchema = z.object({
    futsalId: z.string().min(1),
    playerId: z.string().min(1),
    bookingId: z.string().min(1),
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional(),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
