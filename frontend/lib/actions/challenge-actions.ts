"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Challenge } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fetchMyChallengesAction() {
  const session = await requireSession();
  return apiFetch<{ sent: Challenge[]; received: Challenge[] }>("/challenges/me", {
    token: session.token,
  });
}

export async function sendChallengeAction(
  opponentTeamId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    challengerTeamId: String(formData.get("challengerTeamId") || ""),
    opponentTeamId,
    proposedDate: String(formData.get("proposedDate") || ""),
    proposedTime: String(formData.get("proposedTime") || ""),
    preferredFutsalId: String(formData.get("preferredFutsalId") || "") || undefined,
    message: String(formData.get("message") || "") || undefined,
  };

  const res = await apiFetch<Challenge>("/challenges", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to send challenge" };
  }

  revalidatePath("/challenges");
  return { success: true, message: "Challenge sent!" };
}

export async function acceptChallengeAction(id: string) {
  const session = await requireSession();
  const res = await apiFetch(`/challenges/${id}/accept`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/challenges");
  return res;
}

export async function rejectChallengeAction(id: string) {
  const session = await requireSession();
  const res = await apiFetch(`/challenges/${id}/reject`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/challenges");
  return res;
}

export async function withdrawChallengeAction(id: string) {
  const session = await requireSession();
  const res = await apiFetch(`/challenges/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/challenges");
  return res;
}

export async function counterChallengeAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    counterDate: String(formData.get("counterDate") || ""),
    counterTime: String(formData.get("counterTime") || ""),
    counterFutsalId: String(formData.get("counterFutsalId") || "") || undefined,
  };

  const res = await apiFetch<Challenge>(`/challenges/${id}/counter`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to send counter offer" };
  }

  revalidatePath("/challenges");
  return { success: true, message: "Counter offer sent" };
}
