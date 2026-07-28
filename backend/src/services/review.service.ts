import { ReviewMongoRepository } from "../repositories/review.repository";
import { BookingMongoRepository } from "../repositories/booking.repository";
import { FutsalMongoRepository } from "../repositories/futsal.repository";
import { NotifyService } from "../repositories/notification.repository";
import { CreateReviewDTO } from "../dtos/review.dto";
import { IReview } from "../models/review.model";
import { HttpException } from "../exceptions/http-exception";

const reviewRepository = new ReviewMongoRepository();
const bookingRepository = new BookingMongoRepository();
const futsalRepository = new FutsalMongoRepository();

export class ReviewService {
    async createReview(playerId: string, data: CreateReviewDTO): Promise<IReview> {
        const booking = await bookingRepository.findById(data.bookingId);
        if (!booking) throw new HttpException(404, "Booking not found");
        if (booking.playerId !== playerId) {
            throw new HttpException(403, "You can only review your own bookings");
        }
        if (booking.status !== "approved" && booking.status !== "completed") {
            throw new HttpException(400, "You can only review a booking that was played");
        }

        const existing = await reviewRepository.findByBookingId(data.bookingId);
        if (existing) throw new HttpException(400, "You already reviewed this booking");

        const review = await reviewRepository.create({
            futsalId: booking.futsalId,
            playerId,
            bookingId: data.bookingId,
            rating: data.rating,
            comment: data.comment,
        });

        const { avg, count } = await reviewRepository.getFutsalAverage(booking.futsalId);
        await futsalRepository.update(booking.futsalId, { rating: avg, reviewCount: count });

        const futsal = await futsalRepository.findById(booking.futsalId);
        if (futsal) {
            await NotifyService.send(
                futsal.organizerId,
                "new_review",
                `${futsal.name} received a new ${data.rating}★ review`,
                review._id.toString()
            );
        }

        return review;
    }

    async getFutsalReviews(futsalId: string): Promise<IReview[]> {
        return await reviewRepository.findByFutsal(futsalId);
    }
}
