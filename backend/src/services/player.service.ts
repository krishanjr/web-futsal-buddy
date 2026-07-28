import { PlayerProfileModel } from "../models/player.model";
import { HttpException } from "../exceptions/http-exception";
import { CreatePlayerProfileDTO, UpdatePlayerProfileDTO, SearchPlayerDTO } from "../dtos/player.dto";

export class PlayerService {
    async createProfile(userId: string, data: CreatePlayerProfileDTO) {
        const existing = await PlayerProfileModel.findOne({ userId });
        if (existing) throw new HttpException(400, "Player profile already exists");
        return await PlayerProfileModel.create({ userId, ...data });
    }

    async getMyProfile(userId: string) {
        const profile = await PlayerProfileModel.findOne({ userId });
        if (!profile) throw new HttpException(404, "Player profile not found");
        return profile;
    }

    async getProfileById(id: string) {
        const profile = await PlayerProfileModel.findById(id);
        if (!profile) throw new HttpException(404, "Player profile not found");
        return profile;
    }

    async updateProfile(userId: string, data: UpdatePlayerProfileDTO) {
        const profile = await PlayerProfileModel.findOne({ userId });
        if (!profile) throw new HttpException(404, "Player profile not found");
        return await PlayerProfileModel.findByIdAndUpdate(profile._id, data, { new: true });
    }

    async deleteProfile(userId: string) {
        const profile = await PlayerProfileModel.findOne({ userId });
        if (!profile) throw new HttpException(404, "Player profile not found");
        await PlayerProfileModel.findByIdAndDelete(profile._id);
    }

    async searchPlayers(query: SearchPlayerDTO) {
        return this._searchProfiles(query);
    }

    async searchTeammates(query: SearchPlayerDTO) {
        return this._searchProfiles(query);
    }

    async searchOpponents(query: SearchPlayerDTO) {
        return this._searchProfiles(query);
    }

    private async _searchProfiles(query: SearchPlayerDTO) {
        const filters: Record<string, any> = { isAvailable: true };
        if (query.lookingFor) {
            filters.lookingFor = { $in: [query.lookingFor, "both"] };
        }
        if (query.position) filters.position = query.position;
        if (query.skillLevel) filters.skillLevel = query.skillLevel;
        if (query.city) filters.city = { $regex: query.city, $options: "i" };
        if (query.search) {
            filters.$or = [
                { city: { $regex: query.search, $options: "i" } },
            ];
        }

        const skip = (query.page - 1) * query.limit;
        const [profiles, total] = await Promise.all([
            PlayerProfileModel.find(filters).skip(skip).limit(query.limit).sort({ createdAt: -1 }),
            PlayerProfileModel.countDocuments(filters),
        ]);

        return {
            players: profiles,
            meta: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) || 1 },
        };
    }
}