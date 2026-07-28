import { z } from "zod";

export const CreateTeamDTO = z.object({
    name: z.string().min(1, "Team name is required"),
    city: z.string().min(1, "City is required"),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed", "any"]).default("any"),
    maxMembers: z.number().min(2).max(20).default(10),
    isOpen: z.boolean().default(true),
    description: z.string().max(1000).optional(),
});
export type CreateTeamDTO = z.infer<typeof CreateTeamDTO>;

export const UpdateTeamDTO = z.object({
    name: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed", "any"]).optional(),
    maxMembers: z.number().min(2).max(20).optional(),
    isOpen: z.boolean().optional(),
    description: z.string().max(1000).optional(),
});
export type UpdateTeamDTO = z.infer<typeof UpdateTeamDTO>;

export const SearchTeamDTO = z.object({
    city: z.string().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed", "any"]).optional(),
    isOpen: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchTeamDTO = z.infer<typeof SearchTeamDTO>;