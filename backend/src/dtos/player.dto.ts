import { z } from "zod";

export const CreatePlayerProfileDTO = z.object({
    position: z.enum(["forward", "midfielder", "defender", "goalkeeper", "any"]),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]),
    preferredFoot: z.enum(["right", "left"]).default("right"),
    age: z.number().min(13).max(60),
    city: z.string().min(1),
    bio: z.string().max(500).optional(),
    availability: z.array(z.string()).default([]),
    lookingFor: z.enum(["both", "teammate", "opponent"]).default("both"),
    isAvailable: z.boolean().default(true),
});
export type CreatePlayerProfileDTO = z.infer<typeof CreatePlayerProfileDTO>;

export const UpdatePlayerProfileDTO = z.object({
    position: z.enum(["forward", "midfielder", "defender", "goalkeeper", "any"]).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).optional(),
    preferredFoot: z.enum(["right", "left"]).optional(),
    age: z.number().min(13).max(60).optional(),
    city: z.string().min(1).optional(),
    bio: z.string().max(500).optional(),
    availability: z.array(z.string()).optional(),
    lookingFor: z.enum(["both", "teammate", "opponent"]).optional(),
    isAvailable: z.boolean().optional(),
}).partial();
export type UpdatePlayerProfileDTO = z.infer<typeof UpdatePlayerProfileDTO>;

export const SearchPlayerDTO = z.object({
    position: z.enum(["forward", "midfielder", "defender", "goalkeeper", "any"]).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).optional(),
    lookingFor: z.enum(["both", "teammate", "opponent"]).optional(),
    city: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchPlayerDTO = z.infer<typeof SearchPlayerDTO>;