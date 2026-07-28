import { Router } from "express";
import { ChallengeController } from "../../controllers/player/challenge.controller";
import { authorizedMiddleware } from "../../middlewares/authorized.middleware";

const challengeRouter = Router();
const challengeController = new ChallengeController();

challengeRouter.post("/", authorizedMiddleware, (req, res) => challengeController.sendChallenge(req, res));
challengeRouter.get("/me", authorizedMiddleware, (req, res) => challengeController.getMyChallenges(req, res));
challengeRouter.patch("/:id/accept", authorizedMiddleware, (req, res) => challengeController.acceptChallenge(req, res));
challengeRouter.patch("/:id/reject", authorizedMiddleware, (req, res) => challengeController.rejectChallenge(req, res));
challengeRouter.patch("/:id/counter", authorizedMiddleware, (req, res) => challengeController.counterChallenge(req, res));
challengeRouter.delete("/:id", authorizedMiddleware, (req, res) => challengeController.withdrawChallenge(req, res));

export default challengeRouter;
