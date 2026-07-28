import { z } from "zod";

// A Post is how the two-sided marketplace actually gets kicked off:
//  - "team_recruit"       an organizer's team publicly needs players
//  - "player_seeking_team" a player is looking for a team to join
//  - "opponent_request"    an organizer's team wants a scheduled match against another team
export const PostTypeEnum = z.enum(["team_recruit", "player_seeking_team", "opponent_request"]);
export type PostTypeEnum = z.infer<typeof PostTypeEnum>;

export const PostStatusEnum = z.enum(["open", "filled", "closed"]);
export type PostStatusEnum = z.infer<typeof PostStatusEnum>;

export const PostSchema = z.object({
    postType: PostTypeEnum,
    title: z.string().min(3).max(120),
    description: z.string().max(1000).optional(),
    city: z.string().min(1),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "any"]).default("any"),

    // team_recruit / opponent_request — which of the organizer's teams this is about
    teamId: z.string().optional(),

    // team_recruit — what position(s) they need, how many spots
    position: z
        .enum(["goalkeeper", "defender", "midfielder", "forward", "any"])
        .default("any"),
    slotsNeeded: z.number().int().min(1).max(20).default(1),

    // opponent_request — proposed match logistics (mirrors Match fields so we can
    // spin up a real Match the moment a challenge is accepted)
    venue: z.string().optional(),
    matchDate: z.string().optional(),
    matchTime: z.string().optional(),
    maxPlayers: z.number().int().min(2).max(40).optional(),

    status: PostStatusEnum.default("open"),
});
export type PostSchemaType = z.infer<typeof PostSchema>;

export const ApplicationStatusEnum = z.enum(["pending", "accepted", "rejected", "withdrawn"]);
export type ApplicationStatusEnum = z.infer<typeof ApplicationStatusEnum>;

export const ApplicationSchema = z.object({
    postId: z.string(),
    applicantId: z.string(),
    applicantRole: z.enum(["player", "organizer"]),
    // set when an organizer applies on behalf of one of their own teams
    // (player_seeking_team → recruiting; opponent_request → proposing a match)
    teamId: z.string().optional(),
    message: z.string().max(500).optional(),
    status: ApplicationStatusEnum.default("pending"),
});
export type ApplicationSchemaType = z.infer<typeof ApplicationSchema>;
