"use server";

import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { DashboardStats } from "@/lib/types";

export async function fetchDashboardAction() {
  const session = await requireSession();
  return apiFetch<DashboardStats>("/admin/dashboard", {
    token: session.token,
  });
}
