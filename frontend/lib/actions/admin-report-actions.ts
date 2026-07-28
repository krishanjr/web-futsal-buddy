"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Report, PaginationMeta } from "@/lib/types";

export async function fetchAdminReportsAction(params: {
  page?: number;
  size?: number;
  status?: string;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.status) qs.set("status", params.status);

  return apiFetch<{ reports: Report[]; pagination: PaginationMeta }>(
    `/admin/reports?${qs.toString()}`,
    { token: session.token }
  );
}

export async function resolveReportAction(id: string, status: "resolved" | "dismissed") {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/admin/reports/${id}/resolve`, {
    method: "PATCH",
    token: session.token,
    body: { status },
  });
  revalidatePath("/admin/reports");
}
