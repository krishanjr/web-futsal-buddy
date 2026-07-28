"use server";

import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Analytics } from "@/lib/types";

export async function fetchAnalyticsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Analytics>("/admin/analytics", { token: session.token });
}
