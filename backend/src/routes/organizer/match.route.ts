import { Router } from "express";
import { MatchController } from "../../controllers/organizer/match.controller";
import { authorizedMiddleware } from "../../middlewares/authorized.middleware";

const matchRouter = Router();
const matchController = new MatchController();

matchRouter.get("/", authorizedMiddleware, (req, res) => matchController.getAllMatches(req, res));
matchRouter.get("/:id", authorizedMiddleware, (req, res) => matchController.getMatchById(req, res));
matchRouter.post("/", authorizedMiddleware, (req, res) => matchController.createMatch(req, res));
matchRouter.put("/:id", authorizedMiddleware, (req, res) => matchController.updateMatch(req, res));
matchRouter.delete("/:id", authorizedMiddleware, (req, res) => matchController.deleteMatch(req, res));
matchRouter.post("/:id/join", authorizedMiddleware, (req, res) => matchController.joinMatch(req, res));
matchRouter.get("/search", authorizedMiddleware, (req, res) => matchController.searchMatches(req, res));

export default matchRouter;