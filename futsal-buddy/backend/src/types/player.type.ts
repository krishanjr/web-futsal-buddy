import { z } from "zod";

export const PlayerProfileSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    position: z.enum(["goalkeeper", "defender", "midfielder", "forward", "any"]).default("any"),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).default("beginner"),
    preferredFoot: z.enum(["left", "right", "both"]).default("right"),
    age: z.number().min(10, "Age must be at least 10").max(70, "Age must be under 70"),
    city: z.string().min(1, "City is required"),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    availability: z.array(
        z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    ).default([]),
    stats: z.object({
        matchesPlayed: z.number().default(0),
        wins: z.number().default(0),
        losses: z.number().default(0),
        goals: z.number().default(0),
        assists: z.number().default(0),
    }).optional(),
    lookingFor: z.enum(["teammate", "opponent", "both"]).default("both"),
    isAvailable: z.boolean().default(true),
});

export type PlayerProfileType = z.infer<typeof PlayerProfileSchema>;
