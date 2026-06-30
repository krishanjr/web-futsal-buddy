"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { AdminUser, PaginationMeta } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fetchUsersAction(params: {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
}) {
  const session = await requireSession();
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));
  if (params.search) qs.set("search", params.search);
  if (params.role) qs.set("role", params.role);

  return apiFetch<{ users: AdminUser[]; pagination: PaginationMeta }>(
    `/admin/users?${qs.toString()}`,
    { token: session.token }
  );
}

export async function fetchUserByIdAction(id: string) {
  const session = await requireSession();
  return apiFetch<AdminUser>(`/admin/users/${id}`, { token: session.token });
}

export async function createUserAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    email: String(formData.get("email") || ""),
    username: String(formData.get("username") || ""),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "player"),
    isActive: formData.get("isActive") === "on",
    isVerified: formData.get("isVerified") === "on",
  };

  const res = await apiFetch<AdminUser>("/admin/users", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create user" };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const body = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    username: String(formData.get("username") || ""),
    role: String(formData.get("role") || "player"),
    isActive: formData.get("isActive") === "on",
  };

  const res = await apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: "PATCH",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update user" };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserAction(id: string) {
  const session = await requireSession();
  await apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/admin/users");
}

export async function toggleUserActiveAction(id: string, activate: boolean) {
  const session = await requireSession();
  await apiFetch(`/admin/users/${id}/${activate ? "activate" : "deactivate"}`, {
    method: "PATCH",
    token: session.token,
  });
  revalidatePath("/admin/users");
}
