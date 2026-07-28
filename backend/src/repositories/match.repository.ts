import { MatchModel, IMatch } from "../models/match.model";

export class MatchMongoRepository {
    async create(data: Partial<IMatch>): Promise<IMatch> {
        return await MatchModel.create(data);
    }

    async findById(id: string): Promise<IMatch | null> {
        return await MatchModel.findById(id);
    }

    async findByOrganizer(organizerId: string): Promise<IMatch[]> {
        return await MatchModel.find({ organizerId });
    }

    async update(id: string, data: Partial<IMatch>): Promise<IMatch | null> {
        return await MatchModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await MatchModel.findByIdAndDelete(id);
    }

    async addPlayer(matchId: string, userId: string): Promise<IMatch | null> {
        return await MatchModel.findByIdAndUpdate(
            matchId,
            { $addToSet: { players: userId } },
            { new: true }
        );
    }

    async removePlayer(matchId: string, userId: string): Promise<IMatch | null> {
        return await MatchModel.findByIdAndUpdate(
            matchId,
            { $pull: { players: userId } },
            { new: true }
        );
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<IMatch[]> {
        const query: Record<string, any> = {};
        if (filters.city) query.city = { $regex: filters.city, $options: "i" };
        if (filters.skillLevel) query.skillLevel = filters.skillLevel;
        if (filters.matchType) query.matchType = filters.matchType;
        if (filters.status) query.status = filters.status;
        return await MatchModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        const query: Record<string, any> = {};
        if (filters.city) query.city = { $regex: filters.city, $options: "i" };
        if (filters.skillLevel) query.skillLevel = filters.skillLevel;
        if (filters.matchType) query.matchType = filters.matchType;
        if (filters.status) query.status = filters.status;
        return await MatchModel.countDocuments(query);
    }
}