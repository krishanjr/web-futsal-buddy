import { ApplicationModel, IApplication } from "../models/application.model";

export class ApplicationMongoRepository {
    async create(application: Partial<IApplication>): Promise<IApplication> {
        return await ApplicationModel.create(application);
    }

    async findById(id: string): Promise<IApplication | null> {
        return await ApplicationModel.findById(id);
    }

    async findByPost(postId: string): Promise<IApplication[]> {
        return await ApplicationModel.find({ postId }).sort({ createdAt: -1 });
    }

    async findByApplicant(applicantId: string): Promise<IApplication[]> {
        return await ApplicationModel.find({ applicantId }).sort({ createdAt: -1 });
    }

    async findPendingByPostAndApplicant(
        postId: string,
        applicantId: string
    ): Promise<IApplication | null> {
        return await ApplicationModel.findOne({ postId, applicantId, status: "pending" });
    }

    async update(id: string, data: Partial<IApplication>): Promise<IApplication | null> {
        return await ApplicationModel.findByIdAndUpdate(id, data, { new: true });
    }

    async rejectAllPendingForPost(postId: string, exceptId?: string): Promise<void> {
        const filter: Record<string, any> = { postId, status: "pending" };
        if (exceptId) filter._id = { $ne: exceptId };
        await ApplicationModel.updateMany(filter, { status: "rejected" });
    }
}
