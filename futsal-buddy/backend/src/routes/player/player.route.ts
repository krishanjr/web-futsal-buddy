import { Router } from "express";
import { PlayerController } from "../../controllers/player/player.controller";
import { authorizedMiddleware, playerMiddleware } from "../../middlewares/authorized.middleware";

const playerRouter = Router();
const playerController = new PlayerController();

// Search (any logged-in user can search)
playerRouter.get("/search", authorizedMiddleware, (req, res) => playerController.searchPlayers(req, res));
playerRouter.get("/search/teammates", authorizedMiddleware, (req, res) => playerController.searchTeammates(req, res));
playerRouter.get("/search/opponents", authorizedMiddleware, (req, res) => playerController.searchOpponents(req, res));

// View specific player profile (public within app)
playerRouter.get("/:id", authorizedMiddleware, (req, res) => playerController.getProfileById(req, res));

// Player profile CRUD (player or admin only)
playerRouter.post("/", authorizedMiddleware, playerMiddleware, (req, res) => playerController.createProfile(req, res));
playerRouter.get("/me/profile", authorizedMiddleware, playerMiddleware, (req, res) => playerController.getMyProfile(req, res));
playerRouter.patch("/me/profile", authorizedMiddleware, playerMiddleware, (req, res) => playerController.updateProfile(req, res));
playerRouter.delete("/me/profile", authorizedMiddleware, playerMiddleware, (req, res) => playerController.deleteProfile(req, res));

export default playerRouter;
