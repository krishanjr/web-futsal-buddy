"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Notification } from "@/lib/types";

export async function fetchMyNotificationsAction() {
  const session = await requireSession();
  return apiFetch<{ notifications: Notification[]; unreadCount: number }>("/notifications/me", {
    token: session.token,
  });
}

export async function markNotificationReadAction(id: string) {
  const session = await requireSession();
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH", token: session.token });
  revalidatePath("/", "layout");
}

export async function markAllNotificationsReadAction() {
  const session = await requireSession();
  await apiFetch("/notifications/read-all", { method: "PATCH", token: session.token });
  revalidatePath("/", "layout");
}
