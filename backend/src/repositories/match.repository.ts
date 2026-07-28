import { MatchModel, IMatch } from "../models/match.model";

export class MatchMongoRepository {
    async create(match: Partial<IMatch>): Promise<IMatch> {
        return await MatchModel.create(match);
    }

    async findById(id: string): Promise<IMatch | null> {
        return await MatchModel.findById(id);
    }

    async findByOrganizer(organizerId: string): Promise<IMatch[]> {
        return await MatchModel.find({ organizerId }).sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<IMatch>): Promise<IMatch | null> {
        return await MatchModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await MatchModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<IMatch[]> {
        return await MatchModel.find(filters).skip(skip).limit(limit).sort({ matchDate: 1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        return await MatchModel.countDocuments(filters);
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
}
