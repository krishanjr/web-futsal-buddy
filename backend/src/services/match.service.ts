import { MatchRepository } from "../repositories/match.repository";
import { CreateMatchDTO, UpdateMatchDTO, SearchMatchDTO } from "../dtos/match.dto";
import { IMatch } from "../models/match.model";
import { HttpException } from "../exceptions/http-exception";
import { TeamBalancerService } from "./team-balancer.service";
import { NotifyService } from "../repositories/notification.repository";

const matchRepository = new MatchRepository();
const teamBalancer = new TeamBalancerService();

export class MatchService {
    async createMatch(organizerId: string, data: CreateMatchDTO): Promise<IMatch> {
        const match = await matchRepository.create({ ...data, organizerId });
        return match;
    }

    async getMatchById(id: string): Promise<IMatch> {
        const match = await matchRepository.findById(id);
        if (!match) throw new HttpException(404, "Match not found");
        return match;
    }

    async getMyMatches(organizerId: string): Promise<IMatch[]> {
        return await matchRepository.findByOrganizer(organizerId);
    }

    async updateMatch(organizerId: string, matchId: string, data: UpdateMatchDTO): Promise<IMatch> {
        const match = await matchRepository.findById(matchId);
        if (!match) throw new HttpException(404, "Match not found");
        if (match.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to update this match");
        }
        const updated = await matchRepository.update(matchId, data as Partial<IMatch>);
        if (!updated) throw new HttpException(500, "Failed to update match");
        return updated;
    }

    async deleteMatch(organizerId: string, matchId: string): Promise<void> {
        const match = await matchRepository.findById(matchId);
        if (!match) throw new HttpException(404, "Match not found");
        if (match.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to delete this match");
        }
        await matchRepository.delete(matchId);
    }

    async searchMatches(query: SearchMatchDTO) {
        const filters: Record<string, any> = {};
        if (query.city) filters.city = { $regex: query.city, $options: "i" };
        if (query.skillLevel) filters.skillLevel = query.skillLevel;
        if (query.matchType) filters.matchType = query.matchType;
        if (query.status) filters.status = query.status;
        else filters.status = "open"; // default: show only open matches

        const skip = (query.page - 1) * query.limit;
        const [matches, total] = await Promise.all([
            matchRepository.search(filters, skip, query.limit),
            matchRepository.countSearch(filters),
        ]);

        return {
            matches,
            meta: { page: query.page, limit: query.limit, total },
        };
    }

    async joinMatch(matchId: string, userId: string): Promise<IMatch> {
        const match = await matchRepository.findById(matchId);
        if (!match) throw new HttpException(404, "Match not found");
        if (match.status !== "open") throw new HttpException(400, "This match is not open for joining");
        if (match.players.includes(userId)) throw new HttpException(400, "You have already joined this match");
        if (match.players.length >= match.maxPlayers) {
            throw new HttpException(400, "Match is already full");
        }

        const updated = await matchRepository.addPlayer(matchId, userId);
        if (!updated) throw new HttpException(500, "Failed to join match");

        // Auto-update status to full if maxPlayers reached, and auto-assign
        // balanced teams via the ML strength model — the "lobby fills up,
        // teams get revealed" moment.
        if (updated.players.length >= updated.maxPlayers) {
            const { teamA, teamB } = await teamBalancer.balanceTeams(updated.players);
            const finalized = await matchRepository.update(matchId, {
                status: "full",
                teamA,
                teamB,
                teamsAssigned: true,
            } as Partial<IMatch>);

            await Promise.all(
                updated.players.map((pid) =>
                    NotifyService.send(
                        pid,
                        "team_joined",
                        `"${updated.title}" is full — teams have been assigned! Check your lobby.`,
                        matchId
                    )
                )
            );

            return finalized || updated;
        }

        return updated;
    }

    async leaveMatch(matchId: string, userId: string): Promise<IMatch> {
        const match = await matchRepository.findById(matchId);
        if (!match) throw new HttpException(404, "Match not found");
        if (!match.players.includes(userId)) {
            throw new HttpException(400, "You have not joined this match");
        }
        if (match.status === "ongoing" || match.status === "completed" || match.status === "cancelled") {
            throw new HttpException(400, `Cannot leave a match that is already ${match.status}`);
        }

        const updated = await matchRepository.removePlayer(matchId, userId);
        if (!updated) throw new HttpException(500, "Failed to leave match");

        // Reopen and clear team assignment if it was full/assigned — the
        // lobby composition changed, so the balanced split is no longer valid.
        if (match.status === "full" || match.teamsAssigned) {
            const reopened = await matchRepository.update(matchId, {
                status: "open",
                teamA: [],
                teamB: [],
                teamsAssigned: false,
            } as Partial<IMatch>);
            return reopened || updated;
        }

        return updated;
    }
}
