import { formatZodError } from "../../utils/zod-error.util";
import { Request, Response } from "express";

import { BookingService } from "../../services/booking.service";
import { CreateBookingDTO, OrganizerBookingQueryDTO } from "../../dtos/booking.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { IUser } from "../../models/user.model";

const bookingService = new BookingService();

export class BookingController {
    // ─── Player ─────────────────────────────────────────────────────────────

    async createBooking(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const parsed = CreateBookingDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const booking = await bookingService.createBooking(playerId, parsed.data);
            return ApiResponseHelper.success(res, booking, "Booking requested — awaiting organizer approval", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyBookings(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const bookings = await bookingService.getMyBookings(playerId);
            return ApiResponseHelper.success(res, bookings, "Bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const playerId = (req.user as IUser)._id.toString();
            const booking = await bookingService.cancelBooking(playerId, req.params.id);
            return ApiResponseHelper.success(res, booking, "Booking cancelled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getAvailability(req: Request, res: Response) {
        try {
            const date = String(req.query.date || "");
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return ApiResponseHelper.error(res, "date query param (YYYY-MM-DD) is required", 400);
            }
            const result = await bookingService.getAvailability(req.params.futsalId, date);
            return ApiResponseHelper.success(res, result, "Availability fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    // ─── Organizer ──────────────────────────────────────────────────────────

    async getOrganizerBookings(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const parsed = OrganizerBookingQueryDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const bookings = await bookingService.getOrganizerBookings(organizerId, parsed.data);
            return ApiResponseHelper.success(res, bookings, "Bookings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async approveBooking(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const booking = await bookingService.approveBooking(organizerId, req.params.id);
            return ApiResponseHelper.success(res, booking, "Booking approved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async rejectBooking(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const booking = await bookingService.rejectBooking(organizerId, req.params.id);
            return ApiResponseHelper.success(res, booking, "Booking rejected");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async rescheduleBooking(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const { date, startTime, endTime } = req.body;
            if (!date || !startTime || !endTime) {
                return ApiResponseHelper.error(res, "date, startTime, and endTime are required", 400);
            }
            const booking = await bookingService.rescheduleBooking(organizerId, req.params.id, {
                date,
                startTime,
                endTime,
            });
            return ApiResponseHelper.success(res, booking, "Booking rescheduled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getEarnings(req: Request, res: Response) {
        try {
            const organizerId = (req.user as IUser)._id.toString();
            const earnings = await bookingService.getEarnings(organizerId);
            return ApiResponseHelper.success(res, earnings, "Earnings fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
