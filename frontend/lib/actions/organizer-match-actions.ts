"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { AdminMatch } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fetchMyMatchesAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AdminMatch[]>("/matches/my/matches", { token: session.token });
}

export async function fetchOrganizerMatchByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AdminMatch>(`/matches/${id}`, { token: session.token });
}

export async function createOrganizerMatchAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

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
  };

  const res = await apiFetch<AdminMatch>("/matches", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create match" };
  }

  revalidatePath("/organizer/matches");
  redirect("/organizer/matches");
}

export async function updateOrganizerMatchAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

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

  const res = await apiFetch<AdminMatch>(`/matches/${id}`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update match" };
  }

  revalidatePath("/organizer/matches");
  redirect("/organizer/matches");
}

export async function deleteOrganizerMatchAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/matches/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/organizer/matches");
}
