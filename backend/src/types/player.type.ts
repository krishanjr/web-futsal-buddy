import { z } from "zod";

export const PlayerStatsSchema = z.object({
    matchesPlayed: z.number().min(0).default(0),
    wins: z.number().min(0).default(0),
    losses: z.number().min(0).default(0),
    goals: z.number().min(0).default(0),
    assists: z.number().min(0).default(0),
});
export type PlayerStats = z.infer<typeof PlayerStatsSchema>;

export const PlayerProfileSchema = z.object({
    userId: z.string().min(1),
    position: z.enum(["forward", "midfielder", "defender", "goalkeeper", "any"]),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]),
    preferredFoot: z.enum(["right", "left"]).default("right"),
    age: z.number().min(13).max(60),
    city: z.string().min(1),
    bio: z.string().max(500).optional(),
    availability: z.array(z.string()).default([]),
    stats: PlayerStatsSchema.default({}),
    lookingFor: z.enum(["both", "teammate", "opponent"]).default("both"),
    isAvailable: z.boolean().default(true),
});
export type PlayerProfileType = z.infer<typeof PlayerProfileSchema>;