import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.get("/me", authorizedMiddleware, (req, res) => notificationController.getMyNotifications(req, res));
notificationRouter.patch("/:id/read", authorizedMiddleware, (req, res) => notificationController.markRead(req, res));
notificationRouter.patch("/read-all", authorizedMiddleware, (req, res) => notificationController.markAllRead(req, res));

export default notificationRouter;
