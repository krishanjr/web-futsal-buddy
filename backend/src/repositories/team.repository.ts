import { TeamModel, ITeam } from "../models/team.model";

export class TeamMongoRepository {
    async create(data: Partial<ITeam>): Promise<ITeam> {
        return await TeamModel.create(data);
    }

    async findById(id: string): Promise<ITeam | null> {
        return await TeamModel.findById(id);
    }

    async findByOrganizer(organizerId: string): Promise<ITeam[]> {
        return await TeamModel.find({ organizerId });
    }

    async update(id: string, data: Partial<ITeam>): Promise<ITeam | null> {
        return await TeamModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await TeamModel.findByIdAndDelete(id);
    }

    async addMember(teamId: string, userId: string): Promise<ITeam | null> {
        return await TeamModel.findByIdAndUpdate(
            teamId,
            { $addToSet: { members: userId } },
            { new: true }
        );
    }

    async removeMember(teamId: string, userId: string): Promise<ITeam | null> {
        return await TeamModel.findByIdAndUpdate(
            teamId,
            { $pull: { members: userId } },
            { new: true }
        );
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<ITeam[]> {
        const query: Record<string, any> = {};
        if (filters.city) query.city = { $regex: filters.city, $options: "i" };
        if (filters.skillLevel) query.skillLevel = filters.skillLevel;
        if (filters.isOpen !== undefined) query.isOpen = filters.isOpen;
        return await TeamModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        const query: Record<string, any> = {};
        if (filters.city) query.city = { $regex: filters.city, $options: "i" };
        if (filters.skillLevel) query.skillLevel = filters.skillLevel;
        if (filters.isOpen !== undefined) query.isOpen = filters.isOpen;
        return await TeamModel.countDocuments(query);
    }
}
