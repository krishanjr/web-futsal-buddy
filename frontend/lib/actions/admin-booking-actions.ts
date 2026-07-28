"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Booking, PaginationMeta } from "@/lib/types";

export async function fetchAdminBookingsAction(params: {
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

  return apiFetch<{ bookings: Booking[]; pagination: PaginationMeta }>(
    `/admin/bookings?${qs.toString()}`,
    { token: session.token }
  );
}

export async function cancelAdminBookingAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/admin/bookings/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/admin/bookings");
}
