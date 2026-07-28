import { z } from "zod";

export const NotificationSchema = z.object({
    userId: z.string().min(1),
    type: z.enum([
        "booking_requested",
        "booking_approved",
        "booking_rejected",
        "booking_cancelled",
        "challenge_received",
        "challenge_accepted",
        "challenge_rejected",
        "challenge_countered",
        "invitation_received",
        "team_joined",
        "new_review",
        "new_organizer_registration",
        "reported_user",
        "futsal_verified",
    ]),
    message: z.string().min(1),
    relatedId: z.string().optional(),
    isRead: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
