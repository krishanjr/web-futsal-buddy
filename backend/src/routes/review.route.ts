import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.post("/", authorizedMiddleware, (req, res) => reviewController.createReview(req, res));
reviewRouter.get("/futsal/:futsalId", authorizedMiddleware, (req, res) =>
    reviewController.getFutsalReviews(req, res)
);

export default reviewRouter;
