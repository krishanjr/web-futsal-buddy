"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Booking, Earnings } from "@/lib/types";

export async function fetchOrganizerBookingsAction(params: {
  futsalId?: string;
  status?: string;
  range?: "today" | "week" | "month" | "all";
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.futsalId) qs.set("futsalId", params.futsalId);
  if (params.status) qs.set("status", params.status);
  qs.set("range", params.range || "all");
  return apiFetch<Booking[]>(`/bookings/organizer/mine?${qs.toString()}`, {
    token: session.token,
  });
}

export async function fetchOrganizerEarningsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Earnings>("/bookings/organizer/earnings", { token: session.token });
}

export async function approveBookingAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/bookings/${id}/approve`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/organizer/bookings");
}

export async function rejectBookingAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/bookings/${id}/reject`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/organizer/bookings");
}

export async function rescheduleBookingAction(
  id: string,
  data: { date: string; startTime: string; endTime: string }
) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/bookings/${id}/reschedule`, {
    method: "PATCH",
    token: session.token,
    body: data,
  });
  revalidatePath("/organizer/bookings");
  return res;
}
