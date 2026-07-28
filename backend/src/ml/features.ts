/**
 * Feature engineering for the Player Strength model.
 *
 * IMPORTANT: this exact function must be used for both training and
 * inference — if you change it, you must retrain (npm run train:ml).
 */

export interface PlayerStatsInput {
    skillLevel: "beginner" | "intermediate" | "advanced" | "professional";
    matchesPlayed: number;
    wins: number;
    goals: number;
    assists: number;
}

export const FEATURE_NAMES = [
    "skillLevelScore",
    "winRate",
    "goalsPerMatch",
    "assistsPerMatch",
    "experience", // normalized matchesPlayed, capped
] as const;

const SKILL_LEVEL_SCORE: Record<PlayerStatsInput["skillLevel"], number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    professional: 4,
};

/**
 * Converts raw player stats into the fixed-length feature vector the model
 * expects, in the same order as FEATURE_NAMES.
 */
export function extractFeatures(input: PlayerStatsInput): number[] {
    const matches = Math.max(input.matchesPlayed, 0);
    const winRate = matches > 0 ? input.wins / matches : 0;
    const goalsPerMatch = matches > 0 ? input.goals / matches : 0;
    const assistsPerMatch = matches > 0 ? input.assists / matches : 0;
    const experience = Math.min(matches, 50) / 50; // 0..1, saturates at 50 matches

    return [
        SKILL_LEVEL_SCORE[input.skillLevel],
        winRate,
        goalsPerMatch,
        assistsPerMatch,
        experience,
    ];
}
