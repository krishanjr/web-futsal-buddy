import { PlayerProfileModel, IPlayerProfile } from "../models/player.model";

export interface IPlayerRepository {
    create(profile: Partial<IPlayerProfile>): Promise<IPlayerProfile>;
    findByUserId(userId: string): Promise<IPlayerProfile | null>;
    findById(id: string): Promise<IPlayerProfile | null>;
    update(id: string, data: Partial<IPlayerProfile>): Promise<IPlayerProfile | null>;
    delete(id: string): Promise<boolean>;
    search(filters: Record<string, any>, skip: number, limit: number): Promise<IPlayerProfile[]>;
    countSearch(filters: Record<string, any>): Promise<number>;
}

export class PlayerMongoRepository implements IPlayerRepository {
    async create(profile: Partial<IPlayerProfile>): Promise<IPlayerProfile> {
        return await PlayerProfileModel.create(profile);
    }

    async findByUserId(userId: string): Promise<IPlayerProfile | null> {
        return await PlayerProfileModel.findOne({ userId });
    }

    async findById(id: string): Promise<IPlayerProfile | null> {
        return await PlayerProfileModel.findById(id);
    }

    async update(id: string, data: Partial<IPlayerProfile>): Promise<IPlayerProfile | null> {
        return await PlayerProfileModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await PlayerProfileModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<IPlayerProfile[]> {
        return await PlayerProfileModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        return await PlayerProfileModel.countDocuments(filters);
    }
}
