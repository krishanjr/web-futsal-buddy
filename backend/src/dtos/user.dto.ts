import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const RegisterDTO = UserSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
    password: true,
});
export type RegisterDTO = z.infer<typeof RegisterDTO>;

export const LoginDTO = UserSchema.pick({
    email: true,
    password: true,
});
export type LoginDTO = z.infer<typeof LoginDTO>;

export const UpdateUserDTO = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    isActive: z.boolean().optional(),
    role: z.enum(["player", "organizer", "admin"]).optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
