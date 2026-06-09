import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const userRouter = Router();
const userController = new UserController();

// Public routes
userRouter.post("/register", (req, res) => userController.register(req, res));
userRouter.post("/login", (req, res) => userController.login(req, res));

// Protected routes (all roles)
userRouter.get("/profile", authorizedMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.patch("/profile", authorizedMiddleware, (req, res) => userController.updateProfile(req, res));

export default userRouter;
