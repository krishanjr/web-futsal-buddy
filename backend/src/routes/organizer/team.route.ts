import { Router } from "express";
import { TeamController } from "../../controllers/organizer/team.controller";
import { authorizedMiddleware, organizerMiddleware } from "../../middlewares/authorized.middleware";

const teamRouter = Router();
const teamController = new TeamController();

// Public search (any logged-in user)
teamRouter.get("/search", authorizedMiddleware, (req, res) => teamController.searchTeams(req, res));

// View specific team (any logged-in user)
teamRouter.get("/:id", authorizedMiddleware, (req, res) => teamController.getTeamById(req, res));

// Join/Leave team (any logged-in user)
teamRouter.post("/:id/join", authorizedMiddleware, (req, res) => teamController.joinTeam(req, res));
teamRouter.delete("/:id/leave", authorizedMiddleware, (req, res) => teamController.leaveTeam(req, res));

// Organizer only
teamRouter.post("/", authorizedMiddleware, organizerMiddleware, (req, res) => teamController.createTeam(req, res));
teamRouter.get("/my/teams", authorizedMiddleware, organizerMiddleware, (req, res) => teamController.getMyTeams(req, res));
teamRouter.patch("/:id", authorizedMiddleware, organizerMiddleware, (req, res) => teamController.updateTeam(req, res));
teamRouter.delete("/:id", authorizedMiddleware, organizerMiddleware, (req, res) => teamController.deleteTeam(req, res));

export default teamRouter;
