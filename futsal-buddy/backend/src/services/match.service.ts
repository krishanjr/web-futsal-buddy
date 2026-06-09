import { MatchMongoRepository } from "../repositories/match.repository";
import { CreateMatchDTO, UpdateMatchDTO, SearchMatchDTO } from "../dtos/match.dto";
import { IMatch } from "../models/match.model";
import { HttpException } from "../exceptions/http-exception";

const matchRepository = new MatchMongoRepository();

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

        // Auto-update status to full if maxPlayers reached
        if (updated.players.length >= updated.maxPlayers) {
            await matchRepository.update(matchId, { status: "full" } as Partial<IMatch>);
            updated.status = "full";
        }

        return updated;
    }

    async leaveMatch(matchId: string, userId: string): Promise<IMatch> {
        const match = await matchRepository.findById(matchId);
        if (!match) throw new HttpException(404, "Match not found");
        if (!match.players.includes(userId)) {
            throw new HttpException(400, "You have not joined this match");
        }

        const updated = await matchRepository.removePlayer(matchId, userId);
        if (!updated) throw new HttpException(500, "Failed to leave match");

        // Reopen if was full
        if (match.status === "full") {
            await matchRepository.update(matchId, { status: "open" } as Partial<IMatch>);
            updated.status = "open";
        }

        return updated;
    }
}
