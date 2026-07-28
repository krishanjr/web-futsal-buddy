"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { uploadImageAction } from "@/lib/actions/upload-actions";
import { requireSession } from "@/lib/auth/session";
import {
  AdminMatch,
  AdminTeam,
  AuthUser,
  AvailabilitySlot,
  Booking,
  Futsal,
  PlayerProfile,
  SearchMeta,
} from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

// Step 1: request a 6-digit code by email. Always returns a generic message —
// never reveals whether the email is registered.
export async function forgotPasswordAction(email: string): Promise<ActionResult> {
  const res = await apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
  return {
    success: res.success,
    message: res.success
      ? res.data?.message || "If that email exists, a reset code has been sent."
      : res.message || "Something went wrong",
  };
}

// Step 2: user submits the code they received plus a new password.
export async function verifyResetOtpAction(
  email: string,
  otp: string,
  newPassword: string
): Promise<ActionResult> {
  const res = await apiFetch("/auth/verify-reset-otp", {
    method: "POST",
    body: { email, otp, newPassword },
  });
  if (!res.success) {
    return { success: false, message: res.message || "Failed to reset password" };
  }
  return { success: true, message: "Password reset successfully — you can now log in." };
}

// Step 2: after the browser has completed Firebase's reset-link flow
// (verifyPasswordResetCode + confirmPasswordReset) and signed the user back in
// with Firebase to prove they now know the new password, we sync that same
// password into MongoDB — which is what our own /auth/login actually checks.
export async function completePasswordResetAction(
  idToken: string,
  newPassword: string
): Promise<ActionResult> {
  const res = await apiFetch("/auth/complete-password-reset", {
    method: "POST",
    body: { idToken, newPassword },
  });
  if (!res.success) {
    return { success: false, message: res.message || "Failed to reset password" };
  }
  return { success: true, message: "Password reset successfully — you can now log in." };
}

// ---------- Account profile (users collection) ----------

export async function fetchMyAccountAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AuthUser>("/auth/profile", { token: session.token });
}

export async function updateMyAccountAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const body = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
  };
  const res = await apiFetch("/auth/profile", {
    method: "PATCH",
    token: session.token,
    body,
  });
  if (!res.success) {
    return { success: false, message: res.message || "Failed to update account" };
  }
  revalidatePath("/profile");
  return { success: true, message: "Account updated" };
}

export async function uploadProfilePhotoAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return { success: false, message: "Choose an image first" };
  }

  const uploadResult = await uploadImageAction(file);
  if (!uploadResult.success || !uploadResult.url) {
    return { success: false, message: uploadResult.message || "Upload failed" };
  }

  const patchRes = await apiFetch("/auth/profile", {
    method: "PATCH",
    token: session.token,
    body: { profilePhoto: uploadResult.url },
  });

  if (!patchRes.success) {
    return { success: false, message: patchRes.message || "Failed to save photo" };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profile photo updated" };
}

export async function changePasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match" };
  }
  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters" };
  }

  const res = await apiFetch("/auth/change-password", {
    method: "POST",
    token: session.token,
    body: { currentPassword, newPassword, confirmPassword },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to change password" };
  }
  return { success: true, message: "Password changed successfully" };
}

// ---------- Futsal player profile (position, skill, stats…) ----------

export async function fetchMyPlayerProfileAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<PlayerProfile>("/players/me/profile", { token: session.token });
}

export async function saveMyPlayerProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const exists = String(formData.get("_exists") || "") === "1";

  const body = {
    position: String(formData.get("position") || "any"),
    skillLevel: String(formData.get("skillLevel") || "beginner"),
    preferredFoot: String(formData.get("preferredFoot") || "right"),
    age: Number(formData.get("age") || 18),
    city: String(formData.get("city") || ""),
    bio: String(formData.get("bio") || "") || undefined,
    lookingFor: String(formData.get("lookingFor") || "both"),
    isAvailable: formData.get("isAvailable") === "on",
  };

  const res = await apiFetch<PlayerProfile>(
    exists ? "/players/me/profile" : "/players",
    {
      method: exists ? "PATCH" : "POST",
      token: session.token,
      body,
    }
  );

  if (!res.success) {
    return { success: false, message: res.message || "Failed to save player profile" };
  }
  revalidatePath("/profile");
  return { success: true, message: "Player profile saved" };
}

export async function fetchPlayerProfileByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<PlayerProfile>(`/players/${id}`, { token: session.token });
}

// ---------- Teammate / opponent finder ----------

export async function fetchTeammatesAction(params: {
  city?: string;
  position?: string;
  skillLevel?: string;
  search?: string;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.position) qs.set("position", params.position);
  if (params.skillLevel) qs.set("skillLevel", params.skillLevel);
  qs.set("limit", "20");
  return apiFetch<PlayerProfile[]>(`/players/search/teammates?${qs.toString()}`, {
    token: session.token,
  });
}

export async function fetchOpponentsAction(params: {
  city?: string;
  position?: string;
  skillLevel?: string;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.position) qs.set("position", params.position);
  if (params.skillLevel) qs.set("skillLevel", params.skillLevel);
  qs.set("limit", "20");
  return apiFetch<PlayerProfile[]>(`/players/search/opponents?${qs.toString()}`, {
    token: session.token,
  });
}

// ---------- Matches (browse / join / leave) ----------

export async function fetchOpenMatchesAction(params: {
  city?: string;
  skillLevel?: string;
  matchType?: string;
  status?: string;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.skillLevel) qs.set("skillLevel", params.skillLevel);
  if (params.matchType) qs.set("matchType", params.matchType);
  qs.set("status", params.status || "open");
  qs.set("limit", "20");
  return apiFetch<AdminMatch[]>(`/matches/search?${qs.toString()}`, {
    token: session.token,
  });
}

export async function fetchMatchByIdAction(matchId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<AdminMatch>(`/matches/${matchId}`, { token: session.token });
}

export async function joinMatchAction(matchId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/matches/${matchId}/join`, {
    method: "POST",
    token: session.token,
  });
  revalidatePath("/opponent-finder");
  revalidatePath(`/matches/${matchId}`);
  return res;
}

export async function leaveMatchAction(matchId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/matches/${matchId}/leave`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/opponent-finder");
  revalidatePath(`/matches/${matchId}`);
  return res;
}

export async function fetchMyStrengthAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<{ strength: number; model: { trainedAt: string; metrics: any } }>(
    "/players/me/strength",
    { token: session.token }
  );
}

// ---------- Teams (browse / join / leave) ----------

export async function fetchTeamsAction(params: { city?: string; skillLevel?: string }) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.skillLevel) qs.set("skillLevel", params.skillLevel);
  qs.set("isOpen", "true");
  qs.set("limit", "20");
  return apiFetch<AdminTeam[]>(`/teams/search?${qs.toString()}`, {
    token: session.token,
  });
}

export async function joinTeamAction(teamId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/teams/${teamId}/join`, {
    method: "POST",
    token: session.token,
  });
  revalidatePath("/opponent-finder");
  return res;
}

// ---------- Futsal grounds (browse) ----------

export async function fetchFutsalsAction(params: {
  district?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.district) qs.set("district", params.district);
  if (params.search) qs.set("search", params.search);
  if (params.minPrice !== undefined) qs.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) qs.set("maxPrice", String(params.maxPrice));
  qs.set("limit", "20");
  return apiFetch<Futsal[]>(`/futsals/search?${qs.toString()}`, {
    token: session.token,
  });
}

export async function fetchFutsalByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Futsal>(`/futsals/${id}`, { token: session.token });
}

// ---------- Bookings ----------

export async function fetchAvailabilityAction(futsalId: string, date: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<{ blocked: boolean; slots: AvailabilitySlot[] }>(
    `/bookings/futsal/${futsalId}/availability?date=${date}`,
    { token: session.token }
  );
}

export async function createBookingAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const futsalId = String(formData.get("futsalId") || "");
  const date = String(formData.get("date") || "");
  const startTime = String(formData.get("startTime") || "");
  const endTime = String(formData.get("endTime") || "");

  const res = await apiFetch<Booking>("/bookings", {
    method: "POST",
    token: session.token,
    body: { futsalId, date, startTime, endTime },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create booking" };
  }

  revalidatePath(`/futsals/${futsalId}`);
  revalidatePath("/bookings");
  return { success: true, message: "Booking requested — awaiting organizer approval!" };
}

export async function fetchMyBookingsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Booking[]>("/bookings/me", { token: session.token });
}

export async function cancelBookingAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/bookings/${id}`, { method: "DELETE", token: session.token });
  revalidatePath("/bookings");
}
