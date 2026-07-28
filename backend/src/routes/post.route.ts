import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const postRouter = Router();
const postController = new PostController();

// Static routes first, before any "/:id" style routes.
postRouter.get("/mine", authorizedMiddleware, (req, res) => postController.getMyPosts(req, res));
postRouter.get("/applications/mine", authorizedMiddleware, (req, res) =>
    postController.getMyApplications(req, res)
);

postRouter.post("/", authorizedMiddleware, (req, res) => postController.createPost(req, res));
postRouter.get("/", authorizedMiddleware, (req, res) => postController.searchPosts(req, res));

postRouter.get("/:id", authorizedMiddleware, (req, res) => postController.getPostById(req, res));
postRouter.delete("/:id", authorizedMiddleware, (req, res) => postController.closePost(req, res));

postRouter.post("/:id/apply", authorizedMiddleware, (req, res) => postController.applyToPost(req, res));
postRouter.get("/:id/applications", authorizedMiddleware, (req, res) =>
    postController.getApplicationsForPost(req, res)
);

postRouter.patch("/applications/:applicationId", authorizedMiddleware, (req, res) =>
    postController.reviewApplication(req, res)
);
postRouter.delete("/applications/:applicationId", authorizedMiddleware, (req, res) =>
    postController.withdrawApplication(req, res)
);

export default postRouter;
