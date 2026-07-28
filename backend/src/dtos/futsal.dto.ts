import { z } from "zod";
import { FutsalSchema } from "../types/futsal.type";

export const CreateFutsalDTO = FutsalSchema.omit({
    organizerId: true,
    isVerified: true,
});
export type CreateFutsalDTO = z.infer<typeof CreateFutsalDTO>;

export const UpdateFutsalDTO = FutsalSchema.omit({
    organizerId: true,
    isVerified: true,
}).partial();
export type UpdateFutsalDTO = z.infer<typeof UpdateFutsalDTO>;

export const SearchFutsalDTO = z.object({
    district: z.string().optional(),
    search: z.string().optional(), // matches name
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    facilities: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .transform((v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v])),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
});
export type SearchFutsalDTO = z.infer<typeof SearchFutsalDTO>;

export const SetHolidaysDTO = z.object({
    holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")),
});
export type SetHolidaysDTO = z.infer<typeof SetHolidaysDTO>;

export const AddFutsalImagesDTO = z.object({
    images: z.array(z.string().min(1)).min(1, "At least one image URL is required"),
});
export type AddFutsalImagesDTO = z.infer<typeof AddFutsalImagesDTO>;
