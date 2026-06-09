import { z } from "zod";

export const TeamSchema = z.object({
    name: z.string().min(1, "Team name is required"),
    organizerId: z.string().min(1, "Organizer ID is required"),
    city: z.string().min(1, "City is required"),
    description: z.string().max(500).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed"]).default("mixed"),
    maxMembers: z.number().min(5).max(20).default(10),
    isOpen: z.boolean().default(true),
    logoUrl: z.string().optional(),
});

export type TeamType = z.infer<typeof TeamSchema>;
