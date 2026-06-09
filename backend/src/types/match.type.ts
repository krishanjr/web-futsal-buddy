import { z } from "zod";

export const MatchSchema = z.object({
    title: z.string().min(1, "Match title is required"),
    organizerId: z.string().min(1, "Organizer ID is required"),
    venue: z.string().min(1, "Venue is required"),
    city: z.string().min(1, "City is required"),
    matchDate: z.string().min(1, "Match date is required"),
    matchTime: z.string().min(1, "Match time is required"),
    maxPlayers: z.number().min(4, "Minimum 4 players").max(20, "Maximum 20 players").default(10),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "any"]).default("any"),
    matchType: z.enum(["friendly", "competitive", "tournament"]).default("friendly"),
    description: z.string().max(1000).optional(),
    status: z.enum(["open", "full", "ongoing", "completed", "cancelled"]).default("open"),
    entryFee: z.number().min(0).default(0),
});

export type MatchType = z.infer<typeof MatchSchema>;
