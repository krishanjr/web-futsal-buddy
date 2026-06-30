import { z } from "zod";

export const SearchUserDTO = z.object({
    role: z.enum(["player", "organizer", "admin"]).optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(100).default(10),
});
export type SearchUserDTO = z.infer<typeof SearchUserDTO>;

export const AdminCreateUserDTO = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["player", "organizer", "admin"]).default("player"),
    isVerified: z.boolean().default(false),
    isActive: z.boolean().default(true),
});
export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const AdminListQueryDTO = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(100).default(10),
});
export type AdminListQueryDTO = z.infer<typeof AdminListQueryDTO>;
