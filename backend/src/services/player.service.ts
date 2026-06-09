import { PlayerMongoRepository } from "../repositories/player.repository";
import { CreatePlayerProfileDTO, UpdatePlayerProfileDTO, SearchPlayerDTO } from "../dtos/player.dto";
import { IPlayerProfile } from "../models/player.model";
import { HttpException } from "../exceptions/http-exception";

const playerRepository = new PlayerMongoRepository();

export class PlayerService {
    async createProfile(userId: string, data: CreatePlayerProfileDTO): Promise<IPlayerProfile> {
        const existing = await playerRepository.findByUserId(userId);
        if (existing) {
            throw new HttpException(400, "Player profile already exists. Use update instead.");
        }

        const profile = await playerRepository.create({ ...data, userId });
        return profile;
    }

    async getMyProfile(userId: string): Promise<IPlayerProfile> {
        const profile = await playerRepository.findByUserId(userId);
        if (!profile) {
            throw new HttpException(404, "Player profile not found. Please create one.");
        }
        return profile;
    }

    async getProfileById(id: string): Promise<IPlayerProfile> {
        const profile = await playerRepository.findById(id);
        if (!profile) {
            throw new HttpException(404, "Player profile not found");
        }
        return profile;
    }

    async updateProfile(userId: string, data: UpdatePlayerProfileDTO): Promise<IPlayerProfile> {
        const profile = await playerRepository.findByUserId(userId);
        if (!profile) {
            throw new HttpException(404, "Player profile not found");
        }
        const updated = await playerRepository.update(profile._id.toString(), data as Partial<IPlayerProfile>);
        if (!updated) throw new HttpException(500, "Failed to update profile");
        return updated;
    }

    async deleteProfile(userId: string): Promise<void> {
        const profile = await playerRepository.findByUserId(userId);
        if (!profile) {
            throw new HttpException(404, "Player profile not found");
        }
        await playerRepository.delete(profile._id.toString());
    }

    // Search teammates and opponents
    async searchPlayers(query: SearchPlayerDTO) {
        const filters: Record<string, any> = {};

        if (query.city) filters.city = { $regex: query.city, $options: "i" };
        if (query.position) filters.position = query.position;
        if (query.skillLevel) filters.skillLevel = query.skillLevel;
        if (query.lookingFor) filters.lookingFor = { $in: [query.lookingFor, "both"] };
        if (query.isAvailable !== undefined) filters.isAvailable = query.isAvailable;

        const skip = (query.page - 1) * query.limit;
        const [players, total] = await Promise.all([
            playerRepository.search(filters, skip, query.limit),
            playerRepository.countSearch(filters),
        ]);

        return {
            players,
            meta: { page: query.page, limit: query.limit, total },
        };
    }

    // Search specifically for teammates
    async searchTeammates(query: SearchPlayerDTO) {
        return this.searchPlayers({ ...query, lookingFor: "teammate" });
    }

    // Search specifically for opponents
    async searchOpponents(query: SearchPlayerDTO) {
        return this.searchPlayers({ ...query, lookingFor: "opponent" });
    }
}
