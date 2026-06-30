"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { AdminMatch, PaginationMeta } from "@/lib/types";
import { ActionResult } from "@/lib/actions/admin-user-actions";

export async function fetchMatchesAction(params: {
  page?: number;
  size?: number;
  search?: string;
}) {
  const session = await requireSession();
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.search) qs.set("search", params.search);

  return apiFetch<{ matches: AdminMatch[]; pagination: PaginationMeta }>(
    `/admin/matches?${qs.toString()}`,
    { token: session.token }
  );
}

export async function fetchMatchByIdAction(id: string) {
  const session = await requireSession();
  return apiFetch<AdminMatch>(`/admin/matches/${id}`, { token: session.token });
}

export async function createMatchAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    title: String(formData.get("title") || ""),
    venue: String(formData.get("venue") || ""),
    city: String(formData.get("city") || ""),
    matchDate: String(formData.get("matchDate") || ""),
    matchTime: String(formData.get("matchTime") || ""),
    maxPlayers: Number(formData.get("maxPlayers") || 10),
    skillLevel: String(formData.get("skillLevel") || "any"),
    matchType: String(formData.get("matchType") || "friendly"),
    description: String(formData.get("description") || "") || undefined,
    entryFee: Number(formData.get("entryFee") || 0),
    organizerId: String(formData.get("organizerId") || "") || undefined,
  };

  const res = await apiFetch<AdminMatch>("/admin/matches", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create match" };
  }

  revalidatePath("/admin/matches");
  redirect("/admin/matches");
}

export async function updateMatchAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    title: String(formData.get("title") || ""),
    venue: String(formData.get("venue") || ""),
    city: String(formData.get("city") || ""),
    matchDate: String(formData.get("matchDate") || ""),
    matchTime: String(formData.get("matchTime") || ""),
    maxPlayers: Number(formData.get("maxPlayers") || 10),
    skillLevel: String(formData.get("skillLevel") || "any"),
    matchType: String(formData.get("matchType") || "friendly"),
    description: String(formData.get("description") || "") || undefined,
    status: String(formData.get("status") || "open"),
    entryFee: Number(formData.get("entryFee") || 0),
  };

  const res = await apiFetch<AdminMatch>(`/admin/matches/${id}`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update match" };
  }

  revalidatePath("/admin/matches");
  redirect("/admin/matches");
}

export async function deleteMatchAction(id: string) {
  const session = await requireSession();
  await apiFetch(`/admin/matches/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/admin/matches");
}
