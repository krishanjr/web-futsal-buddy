"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { AdminTeam } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fetchMyTeamsAction() {
  const session = await requireSession();
  return apiFetch<AdminTeam[]>("/teams/my/teams", { token: session.token });
}

export async function fetchOrganizerTeamByIdAction(id: string) {
  const session = await requireSession();
  return apiFetch<AdminTeam>(`/teams/${id}`, { token: session.token });
}

export async function createOrganizerTeamAction(
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
    logoUrl: String(formData.get("logoUrl") || "") || undefined,
  };

  const res = await apiFetch<AdminTeam>("/teams", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create team" };
  }

  revalidatePath("/organizer/teams");
  redirect("/organizer/teams");
}

export async function updateOrganizerTeamAction(
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
    logoUrl: String(formData.get("logoUrl") || "") || undefined,
  };

  const res = await apiFetch<AdminTeam>(`/teams/${id}`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update team" };
  }

  revalidatePath("/organizer/teams");
  redirect("/organizer/teams");
}

export async function deleteOrganizerTeamAction(id: string) {
  const session = await requireSession();
  await apiFetch(`/teams/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/organizer/teams");
}
