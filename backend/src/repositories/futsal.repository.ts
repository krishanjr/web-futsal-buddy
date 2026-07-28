import { FutsalModel, IFutsal } from "../models/futsal.model";

export class FutsalMongoRepository {
    async create(futsal: Partial<IFutsal>): Promise<IFutsal> {
        return await FutsalModel.create(futsal);
    }

    async findById(id: string): Promise<IFutsal | null> {
        return await FutsalModel.findById(id);
    }

    async findByOrganizer(organizerId: string): Promise<IFutsal[]> {
        return await FutsalModel.find({ organizerId }).sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<IFutsal>): Promise<IFutsal | null> {
        return await FutsalModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await FutsalModel.findByIdAndDelete(id);
        return !!deleted;
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<IFutsal[]> {
        return await FutsalModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        return await FutsalModel.countDocuments(filters);
    }

    async findAllForAdmin(filters: Record<string, any>, skip: number, limit: number): Promise<IFutsal[]> {
        return await FutsalModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countAllForAdmin(filters: Record<string, any>): Promise<number> {
        return await FutsalModel.countDocuments(filters);
    }
}
