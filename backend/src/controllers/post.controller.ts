import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { CreatePostDTO, SearchPostDTO, ApplyToPostDTO, ReviewApplicationDTO } from "../dtos/post.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { formatZodError } from "../utils/zod-error.util";
import { IUser } from "../models/user.model";

const postService = new PostService();

function author(req: Request) {
    const user = req.user as IUser;
    return { id: user._id.toString(), role: user.role };
}

export class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const parsed = CreatePostDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const post = await postService.createPost(author(req), parsed.data);
            return ApiResponseHelper.success(res, post, "Post created", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async searchPosts(req: Request, res: Response) {
        try {
            const parsed = SearchPostDTO.safeParse(req.query);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const excludeMine = req.query.excludeMine === "true";
            const result = await postService.searchPosts(
                parsed.data,
                excludeMine ? author(req).id : undefined
            );
            return ApiResponseHelper.success(res, result.posts, "Posts fetched", 200, result.meta);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyPosts(req: Request, res: Response) {
        try {
            const posts = await postService.getMyPosts(author(req).id);
            return ApiResponseHelper.success(res, posts, "Your posts fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getMyApplications(req: Request, res: Response) {
        try {
            const applications = await postService.getMyApplications(author(req).id);
            return ApiResponseHelper.success(res, applications, "Your applications fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getPostById(req: Request, res: Response) {
        try {
            const post = await postService.getPostById(req.params.id);
            return ApiResponseHelper.success(res, post, "Post fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async closePost(req: Request, res: Response) {
        try {
            await postService.closePost(author(req), req.params.id);
            return ApiResponseHelper.success(res, null, "Post closed");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async applyToPost(req: Request, res: Response) {
        try {
            const parsed = ApplyToPostDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const application = await postService.applyToPost(author(req), req.params.id, parsed.data);
            return ApiResponseHelper.success(res, application, "Application submitted", 201);
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async withdrawApplication(req: Request, res: Response) {
        try {
            await postService.withdrawApplication(author(req), req.params.applicationId);
            return ApiResponseHelper.success(res, null, "Application withdrawn");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async getApplicationsForPost(req: Request, res: Response) {
        try {
            const applications = await postService.getApplicationsForPost(author(req), req.params.id);
            return ApiResponseHelper.success(res, applications, "Applicants fetched");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }

    async reviewApplication(req: Request, res: Response) {
        try {
            const parsed = ReviewApplicationDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, formatZodError(parsed.error), 400);
            }
            const result = await postService.reviewApplication(
                author(req),
                req.params.applicationId,
                parsed.data.action
            );
            return ApiResponseHelper.success(
                res,
                result,
                parsed.data.action === "accept" ? "Application accepted" : "Application rejected"
            );
        } catch (err: any) {
            return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
        }
    }
}
