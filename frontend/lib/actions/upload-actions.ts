"use server";

import { requireSession } from "@/lib/auth/session";
import { API_BASE_URL } from "@/lib/api/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  message?: string;
}

/**
 * Uploads a single image file (chosen from the user's device) to the
 * backend's /upload endpoint and returns the publicly reachable URL.
 * Shared by every "upload a photo" feature (profile photo, team logo,
 * futsal photos) so there's exactly one place that talks to the upload API.
 */
export async function uploadImageAction(file: File): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { success: false, message: "Choose an image first" };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Please choose an image file" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "Image must be under 5MB" };
  }

  const session = await requireSession();

  const uploadForm = new FormData();
  uploadForm.append("file", file);

  let uploadJson: { success: boolean; message?: string; data?: { url: string } };
  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.token}` },
      body: uploadForm,
    });
    uploadJson = await res.json();
  } catch {
    return { success: false, message: "Could not reach the upload server" };
  }

  if (!uploadJson.success || !uploadJson.data?.url) {
    return { success: false, message: uploadJson.message || "Upload failed" };
  }

  // Backend serves uploads at /uploads/<file> off the API host, not the
  // /api/v1 base — strip the /api/v1 suffix to get the host origin.
  const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  return { success: true, url: `${apiOrigin}${uploadJson.data.url}` };
}
