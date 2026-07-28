import { PostModel, IPost } from "../models/post.model";

export class PostMongoRepository {
    async create(post: Partial<IPost>): Promise<IPost> {
        return await PostModel.create(post);
    }

    async findById(id: string): Promise<IPost | null> {
        return await PostModel.findById(id);
    }

    async findByAuthor(authorId: string): Promise<IPost[]> {
        return await PostModel.find({ authorId }).sort({ createdAt: -1 });
    }

    async search(filters: Record<string, any>, skip: number, limit: number): Promise<IPost[]> {
        return await PostModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countSearch(filters: Record<string, any>): Promise<number> {
        return await PostModel.countDocuments(filters);
    }

    async update(id: string, data: Partial<IPost>): Promise<IPost | null> {
        return await PostModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await PostModel.findByIdAndDelete(id);
        return !!deleted;
    }
}
