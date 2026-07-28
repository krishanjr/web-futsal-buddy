import { z } from "zod";

export const CreateChallengeDTO = z.object({
    challengerTeamId: z.string().min(1, "Select which of your teams is challenging"),
    opponentTeamId: z.string().min(1, "Opponent team is required"),
    proposedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
    proposedTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    preferredFutsalId: z.string().optional(),
    message: z.string().max(500).optional(),
});
export type CreateChallengeDTO = z.infer<typeof CreateChallengeDTO>;

export const CounterChallengeDTO = z.object({
    counterDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
    counterTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format"),
    counterFutsalId: z.string().optional(),
});
export type CounterChallengeDTO = z.infer<typeof CounterChallengeDTO>;
