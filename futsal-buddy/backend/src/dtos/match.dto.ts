import { z } from "zod";
import { MatchSchema } from "../types/match.type";

export const CreateMatchDTO = MatchSchema.omit({ status: true, organizerId: true });
export type CreateMatchDTO = z.infer<typeof CreateMatchDTO>;

export const UpdateMatchDTO = MatchSchema.omit({ organizerId: true }).partial();
export type UpdateMatchDTO = z.infer<typeof UpdateMatchDTO>;

export const SearchMatchDTO = z.object({
    city: z.string().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "any"]).optional(),
    matchType: z.enum(["friendly", "competitive", "tournament"]).optional(),
    status: z.enum(["open", "full", "ongoing", "completed", "cancelled"]).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchMatchDTO = z.infer<typeof SearchMatchDTO>;
