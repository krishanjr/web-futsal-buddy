import { z } from "zod";
import { PlayerProfileSchema } from "../types/player.type";

export const CreatePlayerProfileDTO = PlayerProfileSchema.omit({ userId: true });
export type CreatePlayerProfileDTO = z.infer<typeof CreatePlayerProfileDTO>;

export const UpdatePlayerProfileDTO = PlayerProfileSchema.omit({ userId: true }).partial();
export type UpdatePlayerProfileDTO = z.infer<typeof UpdatePlayerProfileDTO>;

export const SearchPlayerDTO = z.object({
    city: z.string().optional(),
    position: z.enum(["goalkeeper", "defender", "midfielder", "forward", "any"]).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).optional(),
    lookingFor: z.enum(["teammate", "opponent", "both"]).optional(),
    isAvailable: z.coerce.boolean().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchPlayerDTO = z.infer<typeof SearchPlayerDTO>;
