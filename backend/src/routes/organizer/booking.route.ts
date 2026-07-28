import { Router } from "express";
import { BookingController } from "../../controllers/organizer/booking.controller";
import { authorizedMiddleware, organizerMiddleware, playerMiddleware } from "../../middlewares/authorized.middleware";

const bookingRouter = Router();
const bookingController = new BookingController();

// Availability check (any logged-in user)
bookingRouter.get("/futsal/:futsalId/availability", authorizedMiddleware, (req, res) =>
    bookingController.getAvailability(req, res)
);

// Organizer — manage bookings for their own futsals
bookingRouter.get("/organizer/mine", authorizedMiddleware, organizerMiddleware, (req, res) =>
    bookingController.getOrganizerBookings(req, res)
);
bookingRouter.get("/organizer/earnings", authorizedMiddleware, organizerMiddleware, (req, res) =>
    bookingController.getEarnings(req, res)
);
bookingRouter.patch("/:id/approve", authorizedMiddleware, organizerMiddleware, (req, res) =>
    bookingController.approveBooking(req, res)
);
bookingRouter.patch("/:id/reject", authorizedMiddleware, organizerMiddleware, (req, res) =>
    bookingController.rejectBooking(req, res)
);
bookingRouter.patch("/:id/reschedule", authorizedMiddleware, organizerMiddleware, (req, res) =>
    bookingController.rescheduleBooking(req, res)
);

// Player — book/cancel/history
bookingRouter.post("/", authorizedMiddleware, playerMiddleware, (req, res) =>
    bookingController.createBooking(req, res)
);
bookingRouter.get("/me", authorizedMiddleware, playerMiddleware, (req, res) =>
    bookingController.getMyBookings(req, res)
);
bookingRouter.delete("/:id", authorizedMiddleware, playerMiddleware, (req, res) =>
    bookingController.cancelBooking(req, res)
);

export default bookingRouter;
