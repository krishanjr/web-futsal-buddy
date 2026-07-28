import { z } from "zod";

export const ChallengeSchema = z.object({
    challengerTeamId: z.string().min(1, "Your team is required"),
    challengerPlayerId: z.string().min(1),
    opponentTeamId: z.string().min(1, "Opponent team is required"),
    proposedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
    proposedTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    preferredFutsalId: z.string().optional(),
    message: z.string().max(500).optional(),
    status: z
        .enum(["pending", "accepted", "rejected", "countered", "withdrawn"])
        .default("pending"),
    counterDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    counterTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    counterFutsalId: z.string().optional(),
});

export type ChallengeType = z.infer<typeof ChallengeSchema>;
