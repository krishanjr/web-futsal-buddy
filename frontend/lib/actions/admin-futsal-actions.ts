"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Futsal, PaginationMeta } from "@/lib/types";

export async function fetchAdminFutsalsAction(params: {
  page?: number;
  size?: number;
  search?: string;
  district?: string;
  isVerified?: boolean;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.search) qs.set("search", params.search);
  if (params.district) qs.set("district", params.district);
  if (params.isVerified !== undefined) qs.set("isVerified", String(params.isVerified));

  return apiFetch<{ futsals: Futsal[]; pagination: PaginationMeta }>(
    `/admin/futsals?${qs.toString()}`,
    { token: session.token }
  );
}

export async function verifyFutsalAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/admin/futsals/${id}/verify`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/admin/futsals");
}

export async function unverifyFutsalAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/admin/futsals/${id}/unverify`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/admin/futsals");
}

export async function deleteAdminFutsalAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/admin/futsals/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/admin/futsals");
}
