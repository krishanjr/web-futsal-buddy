import { BookingMongoRepository } from "../repositories/booking.repository";
import { FutsalMongoRepository } from "../repositories/futsal.repository";
import { NotifyService } from "../repositories/notification.repository";
import { CreateBookingDTO, OrganizerBookingQueryDTO } from "../dtos/booking.dto";
import { IBooking } from "../models/booking.model";
import { HttpException } from "../exceptions/http-exception";

const bookingRepository = new BookingMongoRepository();
const futsalRepository = new FutsalMongoRepository();

function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

function startOfWeek(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00Z");
    const day = d.getUTCDay(); // 0 = Sunday
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
}

function startOfMonth(dateStr: string): string {
    return dateStr.slice(0, 7) + "-01";
}

function endOfMonth(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00Z");
    d.setUTCMonth(d.getUTCMonth() + 1);
    d.setUTCDate(0);
    return d.toISOString().slice(0, 10);
}

export class BookingService {
    // ─── Player ─────────────────────────────────────────────────────────────

    async createBooking(playerId: string, data: CreateBookingDTO): Promise<IBooking> {
        const futsal = await futsalRepository.findById(data.futsalId);
        if (!futsal) throw new HttpException(404, "Futsal not found");
        if (!futsal.isActive || !futsal.isVerified) {
            throw new HttpException(400, "This futsal is not currently accepting bookings");
        }

        if (data.date < todayStr()) {
            throw new HttpException(400, "Cannot book a date in the past");
        }

        const startMin = toMinutes(data.startTime);
        const endMin = toMinutes(data.endTime);
        if (endMin <= startMin) {
            throw new HttpException(400, "End time must be after start time");
        }

        const openMin = toMinutes(futsal.openingTime);
        const closeMin = toMinutes(futsal.closingTime);
        if (startMin < openMin || endMin > closeMin) {
            throw new HttpException(
                400,
                `This futsal is only open ${futsal.openingTime}–${futsal.closingTime}`
            );
        }

        if (futsal.holidays.includes(data.date)) {
            throw new HttpException(400, "This futsal is closed (holiday) on the selected date");
        }

        const overlapping = await bookingRepository.findOverlapping(
            data.futsalId,
            data.date,
            data.startTime,
            data.endTime
        );
        if (overlapping.length > 0) {
            throw new HttpException(400, "That time slot is already booked");
        }

        const hours = (endMin - startMin) / 60;
        const price = Math.round(futsal.pricePerHour * hours);

        const booking = await bookingRepository.create({
            futsalId: data.futsalId,
            playerId,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            challengeId: data.challengeId,
            price,
            status: "pending",
        });

        await NotifyService.send(
            futsal.organizerId,
            "booking_requested",
            `New booking request for ${futsal.name} on ${data.date}, ${data.startTime}–${data.endTime}`,
            booking._id.toString()
        );

        return booking;
    }

    async getMyBookings(playerId: string): Promise<IBooking[]> {
        return await bookingRepository.findByPlayer(playerId);
    }

    async cancelBooking(playerId: string, bookingId: string): Promise<IBooking> {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new HttpException(404, "Booking not found");
        if (booking.playerId !== playerId) {
            throw new HttpException(403, "You are not authorized to cancel this booking");
        }
        if (booking.status === "cancelled" || booking.status === "completed") {
            throw new HttpException(400, `Booking is already ${booking.status}`);
        }
        const updated = await bookingRepository.update(bookingId, { status: "cancelled" });
        if (!updated) throw new HttpException(500, "Failed to cancel booking");

        const futsal = await futsalRepository.findById(booking.futsalId);
        if (futsal) {
            await NotifyService.send(
                futsal.organizerId,
                "booking_cancelled",
                `A booking for ${booking.date}, ${booking.startTime}–${booking.endTime} at ${futsal.name} was cancelled`,
                bookingId
            );
        }

        return updated;
    }

    async getAvailability(futsalId: string, date: string) {
        const futsal = await futsalRepository.findById(futsalId);
        if (!futsal) throw new HttpException(404, "Futsal not found");

        if (futsal.holidays.includes(date)) {
            return { blocked: true, slots: [] as { start: string; end: string; status: string }[] };
        }

        const existing = await bookingRepository.findByFutsalAndDate(futsalId, date);

        const slots: { start: string; end: string; status: string }[] = [];
        let cursor = toMinutes(futsal.openingTime);
        const close = toMinutes(futsal.closingTime);

        while (cursor < close) {
            const next = Math.min(cursor + 60, close);
            const start = minutesToHHMM(cursor);
            const end = minutesToHHMM(next);
            const isBooked = existing.some((b) => b.startTime < end && b.endTime > start);
            slots.push({ start, end, status: isBooked ? "booked" : "available" });
            cursor = next;
        }

        return { blocked: false, slots };
    }

    // ─── Organizer ──────────────────────────────────────────────────────────

    async getOrganizerBookings(organizerId: string, query: OrganizerBookingQueryDTO) {
        const futsals = await futsalRepository.findByOrganizer(organizerId);
        const futsalIds = futsals.map((f) => f._id.toString());
        if (futsalIds.length === 0) return [];

        const filters: Record<string, any> = {};
        if (query.futsalId) filters.futsalId = query.futsalId;
        if (query.status) filters.status = query.status;

        const today = todayStr();
        if (query.range === "today") {
            filters.date = today;
        } else if (query.range === "week") {
            filters.date = { $gte: startOfWeek(today), $lte: addDays(startOfWeek(today), 6) };
        } else if (query.range === "month") {
            filters.date = { $gte: startOfMonth(today), $lte: endOfMonth(today) };
        }

        return await bookingRepository.findByFutsalIds(futsalIds, filters);
    }

    async approveBooking(organizerId: string, bookingId: string): Promise<IBooking> {
        const booking = await this.assertOrganizerOwnsBooking(organizerId, bookingId);
        if (booking.status !== "pending") {
            throw new HttpException(400, `Booking is already ${booking.status}`);
        }
        const updated = await bookingRepository.update(bookingId, { status: "approved" });
        if (!updated) throw new HttpException(500, "Failed to approve booking");
        await NotifyService.send(
            booking.playerId,
            "booking_approved",
            `Your booking for ${booking.date}, ${booking.startTime}–${booking.endTime} was approved`,
            bookingId
        );
        return updated;
    }

    async rejectBooking(organizerId: string, bookingId: string): Promise<IBooking> {
        const booking = await this.assertOrganizerOwnsBooking(organizerId, bookingId);
        if (booking.status !== "pending") {
            throw new HttpException(400, `Booking is already ${booking.status}`);
        }
        const updated = await bookingRepository.update(bookingId, { status: "rejected" });
        if (!updated) throw new HttpException(500, "Failed to reject booking");
        await NotifyService.send(
            booking.playerId,
            "booking_rejected",
            `Your booking for ${booking.date}, ${booking.startTime}–${booking.endTime} was rejected`,
            bookingId
        );
        return updated;
    }

    async rescheduleBooking(
        organizerId: string,
        bookingId: string,
        data: { date: string; startTime: string; endTime: string }
    ): Promise<IBooking> {
        const booking = await this.assertOrganizerOwnsBooking(organizerId, bookingId);
        if (booking.status !== "pending" && booking.status !== "approved") {
            throw new HttpException(400, `Cannot reschedule a ${booking.status} booking`);
        }

        const futsal = await futsalRepository.findById(booking.futsalId);
        if (!futsal) throw new HttpException(404, "Futsal not found");

        const startMin = toMinutes(data.startTime);
        const endMin = toMinutes(data.endTime);
        if (endMin <= startMin) throw new HttpException(400, "End time must be after start time");

        const openMin = toMinutes(futsal.openingTime);
        const closeMin = toMinutes(futsal.closingTime);
        if (startMin < openMin || endMin > closeMin) {
            throw new HttpException(400, `This futsal is only open ${futsal.openingTime}–${futsal.closingTime}`);
        }

        const overlapping = (await bookingRepository.findOverlapping(
            booking.futsalId,
            data.date,
            data.startTime,
            data.endTime
        )).filter((b) => b._id.toString() !== bookingId);
        if (overlapping.length > 0) {
            throw new HttpException(400, "That time slot is already booked");
        }

        const hours = (endMin - startMin) / 60;
        const price = Math.round(futsal.pricePerHour * hours);

        const updated = await bookingRepository.update(bookingId, {
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            price,
        });
        if (!updated) throw new HttpException(500, "Failed to reschedule booking");

        await NotifyService.send(
            booking.playerId,
            "booking_approved",
            `Your booking was rescheduled to ${data.date}, ${data.startTime}–${data.endTime}`,
            bookingId
        );

        return updated;
    }

    async getEarnings(organizerId: string) {
        const futsals = await futsalRepository.findByOrganizer(organizerId);
        const futsalIds = futsals.map((f) => f._id.toString());
        if (futsalIds.length === 0) {
            return { total: 0, today: 0, week: 0, month: 0, totalBookings: 0 };
        }

        const today = todayStr();
        const counted = { status: { $in: ["approved", "completed"] } };

        const [all, todayList, weekList, monthList] = await Promise.all([
            bookingRepository.findByFutsalIds(futsalIds, counted),
            bookingRepository.findByFutsalIds(futsalIds, { ...counted, date: today }),
            bookingRepository.findByFutsalIds(futsalIds, {
                ...counted,
                date: { $gte: startOfWeek(today), $lte: addDays(startOfWeek(today), 6) },
            }),
            bookingRepository.findByFutsalIds(futsalIds, {
                ...counted,
                date: { $gte: startOfMonth(today), $lte: endOfMonth(today) },
            }),
        ]);

        const sum = (list: IBooking[]) => list.reduce((acc, b) => acc + b.price, 0);

        return {
            total: sum(all),
            today: sum(todayList),
            week: sum(weekList),
            month: sum(monthList),
            totalBookings: all.length,
        };
    }

    private async assertOrganizerOwnsBooking(
        organizerId: string,
        bookingId: string
    ): Promise<IBooking> {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new HttpException(404, "Booking not found");
        const futsal = await futsalRepository.findById(booking.futsalId);
        if (!futsal || futsal.organizerId !== organizerId) {
            throw new HttpException(403, "You are not authorized to manage this booking");
        }
        return booking;
    }
}

function minutesToHHMM(mins: number): string {
    const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
}
