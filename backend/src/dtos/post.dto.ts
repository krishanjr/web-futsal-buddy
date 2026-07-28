import { z } from "zod";

export const CreatePostDTO = z
    .object({
        postType: z.enum(["team_recruit", "player_seeking_team", "opponent_request"]),
        title: z.string().min(3, "Title must be at least 3 characters").max(120),
        description: z.string().max(1000).optional(),
        city: z.string().min(1, "City is required"),
        skillLevel: z.enum(["beginner", "intermediate", "advanced", "any"]).default("any"),
        teamId: z.string().optional(),
        position: z
            .enum(["goalkeeper", "defender", "midfielder", "forward", "any"])
            .default("any"),
        slotsNeeded: z.coerce.number().int().min(1).max(20).default(1),
        venue: z.string().optional(),
        matchDate: z.string().optional(),
        matchTime: z.string().optional(),
        maxPlayers: z.coerce.number().int().min(2).max(40).optional(),
    })
    .superRefine((data, ctx) => {
        if ((data.postType === "team_recruit" || data.postType === "opponent_request") && !data.teamId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "teamId is required for this post type",
                path: ["teamId"],
            });
        }
        if (data.postType === "opponent_request") {
            if (!data.venue) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Venue is required", path: ["venue"] });
            if (!data.matchDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Match date is required", path: ["matchDate"] });
            if (!data.matchTime) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Match time is required", path: ["matchTime"] });
        }
    });
export type CreatePostDTO = z.infer<typeof CreatePostDTO>;

export const SearchPostDTO = z.object({
    postType: z.enum(["team_recruit", "player_seeking_team", "opponent_request"]).optional(),
    city: z.string().optional(),
    skillLevel: z.enum(["beginner", "intermediate", "advanced", "any"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type SearchPostDTO = z.infer<typeof SearchPostDTO>;

export const ApplyToPostDTO = z.object({
    teamId: z.string().optional(),
    message: z.string().max(500).optional(),
});
export type ApplyToPostDTO = z.infer<typeof ApplyToPostDTO>;

export const ReviewApplicationDTO = z.object({
    action: z.enum(["accept", "reject"]),
});
export type ReviewApplicationDTO = z.infer<typeof ReviewApplicationDTO>;
