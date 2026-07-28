import { Router } from "express";
import { FutsalController } from "../../controllers/organizer/futsal.controller";
import { authorizedMiddleware, organizerMiddleware } from "../../middlewares/authorized.middleware";

const futsalRouter = Router();
const futsalController = new FutsalController();

// Public browse/search (any logged-in user — players browse grounds here)
futsalRouter.get("/search", authorizedMiddleware, (req, res) => futsalController.searchFutsals(req, res));

// Organizer only — must be registered BEFORE the "/:id" catch-all below
futsalRouter.get("/my/futsals", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.getMyFutsals(req, res)
);
futsalRouter.post("/", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.createFutsal(req, res)
);
futsalRouter.patch("/:id", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.updateFutsal(req, res)
);
futsalRouter.delete("/:id", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.deleteFutsal(req, res)
);
futsalRouter.post("/:id/images", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.addImages(req, res)
);
futsalRouter.delete("/:id/images", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.removeImage(req, res)
);
futsalRouter.patch("/:id/holidays", authorizedMiddleware, organizerMiddleware, (req, res) =>
    futsalController.setHolidays(req, res)
);

// View specific futsal (any logged-in user) — must come AFTER the specific routes above
futsalRouter.get("/:id", authorizedMiddleware, (req, res) => futsalController.getFutsalById(req, res));

export default futsalRouter;
