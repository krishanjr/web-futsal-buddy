import { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
    const messages = error.issues.map((issue) => {
        const path = issue.path.join(".");
        return `${path}: ${issue.message}`;
    });
    return messages.join("; ");
}