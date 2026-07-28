import { ReviewModel, IReview } from "../models/review.model";

export class ReviewMongoRepository {
    async create(data: Partial<IReview>): Promise<IReview> {
        return await ReviewModel.create(data);
    }

    async findByBookingId(bookingId: string): Promise<IReview | null> {
        return await ReviewModel.findOne({ bookingId });
    }

    async findByFutsal(futsalId: string): Promise<IReview[]> {
        return await ReviewModel.find({ futsalId }).sort({ createdAt: -1 });
    }

    async getFutsalAverage(futsalId: string): Promise<{ avg: number; count: number }> {
        const reviews = await ReviewModel.find({ futsalId });
        if (reviews.length === 0) return { avg: 0, count: 0 };
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        return { avg: Math.round(avg * 10) / 10, count: reviews.length };
    }
}
