import { TeamModel, ITeam } from "../models/team.model";

export class TeamMongoRepository {
    async create(team: Partial<ITeam>): Promise<ITeam> {
        return await TeamModel.create(team);
    }

    async findById(id: string): Promise<ITeam | null> {
        return await TeamModel.findById(id);
    }

    async findByOrganizer(organizerId: string): Promise<ITeam[]> {
        return await TeamModel.find({ organizerId }).sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<ITeam>): Promise<ITeam | null> {
        return await TeamModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await TeamModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<ITeam[]> {
        return await TeamModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        return await TeamModel.countDocuments(filters);
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
}
