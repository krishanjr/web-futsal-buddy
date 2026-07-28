import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const userRouter = Router();
const userController = new UserController();

// Public routes
userRouter.post("/register", (req, res) => userController.register(req, res));
userRouter.post("/login", (req, res) => userController.login(req, res));
userRouter.post("/google-login", (req, res) => userController.googleLogin(req, res));
userRouter.post("/forgot-password", (req, res) => userController.forgotPassword(req, res));
userRouter.post("/verify-reset-otp", (req, res) => userController.verifyResetOtp(req, res));

// Protected routes (all roles)
userRouter.get("/profile", authorizedMiddleware, (req, res) => userController.getProfile(req, res));
userRouter.patch("/profile", authorizedMiddleware, (req, res) => userController.updateProfile(req, res));
userRouter.post("/change-password", authorizedMiddleware, (req, res) => userController.changePassword(req, res));

export default userRouter;
