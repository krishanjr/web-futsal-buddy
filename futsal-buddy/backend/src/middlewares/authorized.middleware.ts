import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../configs/constant";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";
import { HttpException } from "../exceptions/http-exception";
import { ApiResponseHelper } from "../utils/apihelper.util";

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser;
        }
    }
}

const userRepository = new UserMongoRepository();

export const authorizedMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new HttpException(401, "Unauthorized: Missing or invalid Authorization header");
        }

        const token = authHeader.split(" ")[1];
        if (!token) throw new HttpException(401, "Unauthorized: Token missing");

        const decodedToken = jwt.verify(token, SECRET_KEY) as Record<string, any>;
        if (!decodedToken || !decodedToken.id) {
            throw new HttpException(401, "Unauthorized: Invalid token");
        }

        const user = await userRepository.getUserById(decodedToken.id);
        if (!user) throw new HttpException(401, "Unauthorized: User not found");

        if (!(user as IUser).isActive) {
            throw new HttpException(403, "Your account has been deactivated");
        }

        req.user = user;
        return next();
    } catch (err: Error | any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};

// Admin only
export const adminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new HttpException(401, "Unauthorized: No user info");
        if ((req.user as IUser).role !== "admin") {
            throw new HttpException(403, "Forbidden: Admin access required");
        }
        return next();
    } catch (err: Error | any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};

// Organizer or Admin
export const organizerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new HttpException(401, "Unauthorized: No user info");
        const role = (req.user as IUser).role;
        if (role !== "organizer" && role !== "admin") {
            throw new HttpException(403, "Forbidden: Organizer access required");
        }
        return next();
    } catch (err: Error | any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};

// Player only
export const playerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new HttpException(401, "Unauthorized: No user info");
        const role = (req.user as IUser).role;
        if (role !== "player" && role !== "admin") {
            throw new HttpException(403, "Forbidden: Player access required");
        }
        return next();
    } catch (err: Error | any) {
        return ApiResponseHelper.error(
            res,
            err.message || "Internal Server Error",
            err.status || 500
        );
    }
};
