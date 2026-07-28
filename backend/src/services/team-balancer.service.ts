import { PlayerProfileModel } from "../models/player.model";
import { predictStrength } from "../ml/predict";

export interface TeamAssignment {
    teamA: string[];
    teamB: string[];
}

export class TeamBalancerService {
    /**
     * Splits a pool of userIds into two balanced teams using the ML
     * player-strength model. Falls back to a neutral mid-range strength
     * (50) for any player without a profile, so the draft never breaks.
     *
     * Algorithm: snake draft. Sort players by predicted strength
     * descending, then alternate assignment A,B,B,A,A,B,B,A... This is the
     * standard way to balance two teams from a ranked pool (same idea
     * fantasy-sports drafts use) and keeps the sum of strengths on each
     * side as close as possible without needing combinatorial search.
     */
    async balanceTeams(userIds: string[]): Promise<TeamAssignment> {
        const profiles = await PlayerProfileModel.find({ userId: { $in: userIds } });
        const profileByUserId = new Map(profiles.map((p) => [p.userId, p]));

        const ranked = userIds
            .map((userId) => {
                const profile = profileByUserId.get(userId);
                const strength = profile
                    ? predictStrength({
                          skillLevel: profile.skillLevel,
                          matchesPlayed: profile.stats?.matchesPlayed ?? 0,
                          wins: profile.stats?.wins ?? 0,
                          goals: profile.stats?.goals ?? 0,
                          assists: profile.stats?.assists ?? 0,
                      })
                    : 50; // no profile yet — assume average
                return { userId, strength };
            })
            .sort((a, b) => b.strength - a.strength);

        const teamA: string[] = [];
        const teamB: string[] = [];

        ranked.forEach((player, i) => {
            // snake draft: A,B,B,A,A,B,B,A,...
            const round = Math.floor(i / 2);
            const pickInRound = i % 2;
            const isTeamA = round % 2 === 0 ? pickInRound === 0 : pickInRound === 1;
            (isTeamA ? teamA : teamB).push(player.userId);
        });

        return { teamA, teamB };
    }
}
