import { ReportModel, IReport } from "../models/report.model";

export class ReportMongoRepository {
    async create(data: Partial<IReport>): Promise<IReport> {
        return await ReportModel.create(data);
    }

    async findAllForAdmin(
        filters: Record<string, any>,
        skip: number,
        limit: number
    ): Promise<IReport[]> {
        return await ReportModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countAllForAdmin(filters: Record<string, any>): Promise<number> {
        return await ReportModel.countDocuments(filters);
    }

    async update(id: string, data: Partial<IReport>): Promise<IReport | null> {
        return await ReportModel.findByIdAndUpdate(id, data, { new: true });
    }
}
