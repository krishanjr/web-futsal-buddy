import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const aiRouter = Router();
const aiController = new AIController();

// All AI routes require authentication
aiRouter.get("/my-insights", authorizedMiddleware, (req, res) => aiController.getMyInsights(req, res));
aiRouter.post("/match-tip", authorizedMiddleware, (req, res) => aiController.getMatchTip(req, res));
aiRouter.post("/team-advice", authorizedMiddleware, (req, res) => aiController.getTeamAdvice(req, res));
aiRouter.post("/ask", authorizedMiddleware, (req, res) => aiController.askQuestion(req, res));

export default aiRouter;
