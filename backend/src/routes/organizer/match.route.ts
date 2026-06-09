import { Router } from "express";
import { MatchController } from "../../controllers/organizer/match.controller";
import { authorizedMiddleware, organizerMiddleware } from "../../middlewares/authorized.middleware";

const matchRouter = Router();
const matchController = new MatchController();

// Public search (any logged-in user)
matchRouter.get("/search", authorizedMiddleware, (req, res) => matchController.searchMatches(req, res));

// View specific match (any logged-in user)
matchRouter.get("/:id", authorizedMiddleware, (req, res) => matchController.getMatchById(req, res));

// Join/Leave match (any logged-in user)
matchRouter.post("/:id/join", authorizedMiddleware, (req, res) => matchController.joinMatch(req, res));
matchRouter.delete("/:id/leave", authorizedMiddleware, (req, res) => matchController.leaveMatch(req, res));

// Organizer only: create, manage matches
matchRouter.post("/", authorizedMiddleware, organizerMiddleware, (req, res) => matchController.createMatch(req, res));
matchRouter.get("/my/matches", authorizedMiddleware, organizerMiddleware, (req, res) => matchController.getMyMatches(req, res));
matchRouter.patch("/:id", authorizedMiddleware, organizerMiddleware, (req, res) => matchController.updateMatch(req, res));
matchRouter.delete("/:id", authorizedMiddleware, organizerMiddleware, (req, res) => matchController.deleteMatch(req, res));

export default matchRouter;
