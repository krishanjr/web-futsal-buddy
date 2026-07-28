import { z } from "zod";

export const FutsalSchema = z.object({
    organizerId: z.string().min(1, "Organizer ID is required"),
    name: z.string().min(1, "Futsal name is required"),
    description: z.string().max(1000).optional(),
    district: z.string().min(1, "District is required"),
    municipality: z.string().optional(),
    nearbyLandmark: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    contactNumber: z.string().min(7, "Contact number is required"),
    pricePerHour: z.number().min(0, "Price cannot be negative"),
    openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format, e.g. 06:00"),
    closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm format, e.g. 22:00"),
    facilities: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    isVerified: z.boolean().default(false),
    isActive: z.boolean().default(true),
    holidays: z.array(z.string()).default([]), // ISO date strings, e.g. "2026-07-20"
});

export type FutsalType = z.infer<typeof FutsalSchema>;

export const FUTSAL_FACILITIES = [
    "Parking",
    "Cafeteria",
    "Changing Room",
    "Washroom",
    "Flood Lights",
] as const;
