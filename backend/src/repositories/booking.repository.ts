import { BookingModel, IBooking } from "../models/booking.model";

export class BookingMongoRepository {
    async create(booking: Partial<IBooking>): Promise<IBooking> {
        return await BookingModel.create(booking);
    }

    async findById(id: string): Promise<IBooking | null> {
        return await BookingModel.findById(id);
    }

    async findByPlayer(playerId: string): Promise<IBooking[]> {
        return await BookingModel.find({ playerId }).sort({ date: -1, startTime: -1 });
    }

    async findByFutsalAndDate(futsalId: string, date: string): Promise<IBooking[]> {
        return await BookingModel.find({
            futsalId,
            date,
            status: { $in: ["pending", "approved"] },
        });
    }

    async findOverlapping(
        futsalId: string,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<IBooking[]> {
        return await BookingModel.find({
            futsalId,
            date,
            status: { $in: ["pending", "approved"] },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
        });
    }

    async findByFutsalIds(
        futsalIds: string[],
        filters: Record<string, any> = {}
    ): Promise<IBooking[]> {
        return await BookingModel.find({ futsalId: { $in: futsalIds }, ...filters }).sort({
            date: -1,
            startTime: -1,
        });
    }

    async update(id: string, data: Partial<IBooking>): Promise<IBooking | null> {
        return await BookingModel.findByIdAndUpdate(id, data, { new: true });
    }

    async findAllForAdmin(
        filters: Record<string, any>,
        skip: number,
        limit: number
    ): Promise<IBooking[]> {
        return await BookingModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countAllForAdmin(filters: Record<string, any>): Promise<number> {
        return await BookingModel.countDocuments(filters);
    }

    async countDocuments(filters: Record<string, any>): Promise<number> {
        return await BookingModel.countDocuments(filters);
    }

    // ─── Analytics ──────────────────────────────────────────────────────────

    async aggregateMostBooked(limit: number): Promise<{ futsalId: string; count: number }[]> {
        const result = await BookingModel.aggregate([
            { $match: { status: { $in: ["approved", "completed"] } } },
            { $group: { _id: "$futsalId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
        return result.map((r) => ({ futsalId: r._id, count: r.count }));
    }

    async aggregateMostActivePlayers(limit: number): Promise<{ playerId: string; count: number }[]> {
        const result = await BookingModel.aggregate([
            { $match: { status: { $in: ["approved", "completed"] } } },
            { $group: { _id: "$playerId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ]);
        return result.map((r) => ({ playerId: r._id, count: r.count }));
    }

    async aggregateRevenueByMonth(
        months: number
    ): Promise<{ month: string; revenue: number }[]> {
        const since = new Date();
        since.setMonth(since.getMonth() - (months - 1));
        const sinceStr = since.toISOString().slice(0, 7) + "-01";

        const result = await BookingModel.aggregate([
            {
                $match: {
                    status: { $in: ["approved", "completed"] },
                    date: { $gte: sinceStr },
                },
            },
            {
                $group: {
                    _id: { $substrCP: ["$date", 0, 7] },
                    revenue: { $sum: "$price" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return result.map((r) => ({ month: r._id, revenue: r.revenue }));
    }

    async getTotalRevenue(): Promise<number> {
        const result = await BookingModel.aggregate([
            { $match: { status: { $in: ["approved", "completed"] } } },
            { $group: { _id: null, total: { $sum: "$price" } } },
        ]);
        return result[0]?.total || 0;
    }
}
