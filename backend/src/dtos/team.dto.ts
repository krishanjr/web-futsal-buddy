import { z } from "zod";
import { TeamSchema } from "../types/team.type";

export const CreateTeamDTO = TeamSchema.omit({ organizerId: true });
export type CreateTeamDTO = z.infer<typeof CreateTeamDTO>;

export const UpdateTeamDTO = TeamSchema.omit({ organizerId: true }).partial();
export type UpdateTeamDTO = z.infer<typeof UpdateTeamDTO>;

export const SearchTeamDTO = z.object({
    city: z.string().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed"]).optional(),
    isOpen: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchTeamDTO = z.infer<typeof SearchTeamDTO>;
