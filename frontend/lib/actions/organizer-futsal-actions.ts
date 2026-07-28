"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Futsal } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

function parseFacilities(formData: FormData): string[] {
  return formData.getAll("facilities").map(String);
}

function buildFutsalBody(formData: FormData) {
  return {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || "") || undefined,
    district: String(formData.get("district") || ""),
    municipality: String(formData.get("municipality") || "") || undefined,
    nearbyLandmark: String(formData.get("nearbyLandmark") || "") || undefined,
    latitude: Number(formData.get("latitude") || 0),
    longitude: Number(formData.get("longitude") || 0),
    contactNumber: String(formData.get("contactNumber") || ""),
    pricePerHour: Number(formData.get("pricePerHour") || 0),
    openingTime: String(formData.get("openingTime") || "06:00"),
    closingTime: String(formData.get("closingTime") || "22:00"),
    facilities: parseFacilities(formData),
  };
}

export async function fetchMyFutsalsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Futsal[]>("/futsals/my/futsals", { token: session.token });
}

export async function fetchOrganizerFutsalByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Futsal>(`/futsals/${id}`, { token: session.token });
}

export async function createFutsalAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const res = await apiFetch<Futsal>("/futsals", {
    method: "POST",
    token: session.token,
    body: buildFutsalBody(formData),
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create futsal profile" };
  }

  revalidatePath("/organizer/futsals");
  redirect("/organizer/futsals");
}

export async function updateFutsalAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const res = await apiFetch<Futsal>(`/futsals/${id}`, {
    method: "PATCH",
    token: session.token,
    body: buildFutsalBody(formData),
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update futsal" };
  }

  revalidatePath("/organizer/futsals");
  redirect("/organizer/futsals");
}

export async function deleteFutsalAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  await apiFetch(`/futsals/${id}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/organizer/futsals");
}

export async function addFutsalImagesAction(
  id: string,
  imageUrls: string[]
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  if (imageUrls.length === 0) {
    return { success: false, message: "No images to add" };
  }

  const res = await apiFetch<Futsal>(`/futsals/${id}/images`, {
    method: "POST",
    token: session.token,
    body: { images: imageUrls },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to add images" };
  }

  revalidatePath(`/organizer/futsals/${id}`);
  return { success: true, message: "Images added" };
}

export async function removeFutsalImageAction(id: string, imageUrl: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/futsals/${id}/images`, {
    method: "DELETE",
    token: session.token,
    body: { imageUrl },
  });
  revalidatePath(`/organizer/futsals/${id}`);
  return res;
}

export async function setFutsalHolidaysAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const raw = String(formData.get("holidays") || "");
  const holidays = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const res = await apiFetch<Futsal>(`/futsals/${id}/holidays`, {
    method: "PATCH",
    token: session.token,
    body: { holidays },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to update holidays" };
  }

  revalidatePath(`/organizer/futsals/${id}`);
  return { success: true, message: "Blocked dates updated" };
}
