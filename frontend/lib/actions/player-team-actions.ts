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

export async function fetchMyPlayerTeamsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AdminTeam[]>("/teams/my/teams", { token: session.token });
}

export async function fetchPlayerTeamByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AdminTeam>(`/teams/${id}`, { token: session.token });
}

function buildTeamBody(formData: FormData) {
  return {
    name: String(formData.get("name") || ""),
    city: String(formData.get("city") || ""),
    description: String(formData.get("description") || "") || undefined,
    skillLevel: String(formData.get("skillLevel") || "mixed"),
    maxMembers: Number(formData.get("maxMembers") || 10),
    isOpen: formData.get("isOpen") === "on",
    logoUrl: String(formData.get("logoUrl") || "") || undefined,
  };
}

export async function createPlayerTeamAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const res = await apiFetch<AdminTeam>("/teams", {
    method: "POST",
    token: session.token,
    body: buildTeamBody(formData),
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create team" };
  }

  revalidatePath("/my-team");
  redirect("/my-team");
}

export async function updatePlayerTeamAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const res = await apiFetch<AdminTeam>(`/teams/${id}`, {
    method: "PATCH",
    token: session.token,
    body: buildTeamBody(formData),
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update team" };
  }

  revalidatePath("/my-team");
  redirect("/my-team");
}

export async function deletePlayerTeamAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/teams/${id}`, { method: "DELETE", token: session.token });
  revalidatePath("/my-team");
}

export async function invitePlayerAction(
  teamId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const username = String(formData.get("username") || "").trim();

  if (!username) return { success: false, message: "Enter a username" };

  const res = await apiFetch(`/teams/${teamId}/invite`, {
    method: "POST",
    token: session.token,
    body: { username },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to send invite" };
  }

  return { success: true, message: `Invitation sent to ${username}!` };
}
