import { z } from "zod";

export const CreateReviewDTO = z.object({
    bookingId: z.string().min(1, "Booking is required"),
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional(),
});
export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;
