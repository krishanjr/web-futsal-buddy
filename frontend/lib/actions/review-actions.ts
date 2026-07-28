"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Review } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fetchFutsalReviewsAction(futsalId: string) {
  const session = await requireSession();
  return apiFetch<Review[]>(`/reviews/futsal/${futsalId}`, { token: session.token });
}

export async function createReviewAction(
  bookingId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "") || undefined;

  if (rating < 1 || rating > 5) {
    return { success: false, message: "Please select a rating" };
  }

  const res = await apiFetch<Review>("/reviews", {
    method: "POST",
    token: session.token,
    body: { bookingId, rating, comment },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to submit review" };
  }

  revalidatePath("/bookings");
  return { success: true, message: "Thanks for rating this futsal!" };
}
