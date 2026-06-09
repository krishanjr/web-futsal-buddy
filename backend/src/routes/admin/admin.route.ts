import { Router } from "express";
import { AdminController } from "../../controllers/admin/admin.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminRouter = Router();
const adminController = new AdminController();

// All admin routes require auth + admin role
adminRouter.use(authorizedMiddleware, adminMiddleware);

adminRouter.get("/dashboard", (req, res) => adminController.getDashboard(req, res));
adminRouter.get("/users", (req, res) => adminController.getAllUsers(req, res));
adminRouter.get("/users/:id", (req, res) => adminController.getUserById(req, res));
adminRouter.patch("/users/:id", (req, res) => adminController.updateUser(req, res));
adminRouter.delete("/users/:id", (req, res) => adminController.deleteUser(req, res));
adminRouter.patch("/users/:id/deactivate", (req, res) => adminController.deactivateUser(req, res));
adminRouter.patch("/users/:id/activate", (req, res) => adminController.activateUser(req, res));

export default adminRouter;
