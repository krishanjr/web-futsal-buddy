import { z } from "zod";

export const TeamSchema = z.object({
    name: z.string().min(1, "Team name is required"),
    organizerId: z.string().min(1, "Organizer ID is required"),
    city: z.string().min(1, "City is required"),
    description: z.string().max(1000).optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "mixed", "any"]).default("any"),
    maxMembers: z.number().min(2).max(20).default(10),
    isOpen: z.boolean().default(true),
    members: z.array(z.string()).default([]),
});
export type TeamType = z.infer<typeof TeamSchema>;