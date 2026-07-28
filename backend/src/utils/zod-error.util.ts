import { ZodError } from "zod";

/** Returns a readable string from a Zod validation error */
export function formatZodError(error: ZodError): string {
    const flat = error.flatten();
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const messages = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs ?? []).join(", ")}`)
        .join(" | ");
    return messages || "Validation error";
}
