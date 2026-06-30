"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { AdminTeam, PaginationMeta } from "@/lib/types";
import { ActionResult } from "@/lib/actions/admin-user-actions";

export async function fetchTeamsAction(params: {
  page?: number;
  size?: number;
  search?: string;
}) {
  const session = await requireSession();
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.search) qs.set("search", params.search);

  return apiFetch<{ teams: AdminTeam[]; pagination: PaginationMeta }>(
    `/admin/teams?${qs.toString()}`,
    { token: session.token }
  );
}

export async function fetchTeamByIdAction(id: string) {
  const session = await requireSession();
  return apiFetch<AdminTeam>(`/admin/teams/${id}`, { token: session.token });
}

export async function createTeamAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    name: String(formData.get("name") || ""),
    city: String(formData.get("city") || ""),
    description: String(formData.get("description") || "") || undefined,
    skillLevel: String(formData.get("skillLevel") || "mixed"),
    maxMembers: Number(formData.get("maxMembers") || 10),
    isOpen: formData.get("isOpen") === "on",
    organizerId: String(formData.get("organizerId") || "") || undefined,
  };

  const res = await apiFetch<AdminTeam>("/admin/teams", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create team" };
  }

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function updateTeamAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    name: String(formData.get("name") || ""),
    city: String(formData.get("city") || ""),
    description: String(formData.get("description") || "") || undefined,
    skillLevel: String(formData.get("skillLevel") || "mixed"),
    maxMembers: Number(formData.get("maxMembers") || 10),
    isOpen: formData.get("isOpen") === "on",
  };

  const res = await apiFetch<AdminTeam>(`/admin/teams/${id}`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update team" };
  }

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeamAction(id: string) {
  const session = await requireSession();
  await apiFetch(`/admin/teams/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/admin/teams");
}
