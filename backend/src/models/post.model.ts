import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId;
    postType: "team_recruit" | "player_seeking_team" | "opponent_request";
    authorId: string;
    authorRole: "player" | "organizer";
    title: string;
    description?: string;
    city: string;
    skillLevel: "beginner" | "intermediate" | "advanced" | "any";
    teamId?: string;
    position: "goalkeeper" | "defender" | "midfielder" | "forward" | "any";
    slotsNeeded: number;
    venue?: string;
    matchDate?: string;
    matchTime?: string;
    maxPlayers?: number;
    status: "open" | "filled" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema<IPost>(
    {
        postType: {
            type: String,
            enum: ["team_recruit", "player_seeking_team", "opponent_request"],
            required: true,
        },
        authorId: { type: String, required: true },
        authorRole: { type: String, enum: ["player", "organizer"], required: true },
        title: { type: String, required: true },
        description: { type: String, maxlength: 1000 },
        city: { type: String, required: true },
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced", "any"],
            default: "any",
        },
        teamId: { type: String },
        position: {
            type: String,
            enum: ["goalkeeper", "defender", "midfielder", "forward", "any"],
            default: "any",
        },
        slotsNeeded: { type: Number, default: 1 },
        venue: { type: String },
        matchDate: { type: String },
        matchTime: { type: String },
        maxPlayers: { type: Number },
        status: {
            type: String,
            enum: ["open", "filled", "closed"],
            default: "open",
        },
    },
    { timestamps: true }
);

export const PostModel = mongoose.model<IPost>("Post", PostSchema);
