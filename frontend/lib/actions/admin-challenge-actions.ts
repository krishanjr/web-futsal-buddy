"use server";

import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Challenge, PaginationMeta } from "@/lib/types";

export async function fetchAdminChallengesAction(params: { page?: number; size?: number }) {
  const session = await requireSession();
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));

  return apiFetch<{ challenges: Challenge[]; pagination: PaginationMeta }>(
    `/admin/challenges?${qs.toString()}`,
    { token: session.token }
  );
}
