import { Router } from "express";
import { AdminController } from "../../controllers/admin/admin.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminRouter = Router();
const adminController = new AdminController();

// All admin routes require auth + admin role
adminRouter.use(authorizedMiddleware, adminMiddleware);

adminRouter.get("/dashboard", (req, res) => adminController.getDashboard(req, res));

// Users
adminRouter.get("/users", (req, res) => adminController.getAllUsers(req, res));
adminRouter.post("/users", (req, res) => adminController.createUser(req, res));
adminRouter.get("/users/:id", (req, res) => adminController.getUserById(req, res));
adminRouter.patch("/users/:id", (req, res) => adminController.updateUser(req, res));
adminRouter.delete("/users/:id", (req, res) => adminController.deleteUser(req, res));
adminRouter.patch("/users/:id/deactivate", (req, res) => adminController.deactivateUser(req, res));
adminRouter.patch("/users/:id/activate", (req, res) => adminController.activateUser(req, res));

// Teams
adminRouter.get("/teams", (req, res) => adminController.getAllTeams(req, res));
adminRouter.post("/teams", (req, res) => adminController.createTeam(req, res));
adminRouter.get("/teams/:id", (req, res) => adminController.getTeamById(req, res));
adminRouter.patch("/teams/:id", (req, res) => adminController.updateTeam(req, res));
adminRouter.delete("/teams/:id", (req, res) => adminController.deleteTeam(req, res));

// Matches
adminRouter.get("/matches", (req, res) => adminController.getAllMatches(req, res));
adminRouter.post("/matches", (req, res) => adminController.createMatch(req, res));
adminRouter.get("/matches/:id", (req, res) => adminController.getMatchById(req, res));
adminRouter.patch("/matches/:id", (req, res) => adminController.updateMatch(req, res));
adminRouter.delete("/matches/:id", (req, res) => adminController.deleteMatch(req, res));

export default adminRouter;
