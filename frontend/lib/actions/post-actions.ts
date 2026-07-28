"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import { Post, Application, PostType } from "@/lib/types";

export interface ActionResult {
  success: boolean;
  message?: string;
}

// ---------------------------------------------------------------- create

export async function createPostAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const postType = String(formData.get("postType") || "") as PostType;
  const body: Record<string, unknown> = {
    postType,
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || "") || undefined,
    city: String(formData.get("city") || ""),
    skillLevel: String(formData.get("skillLevel") || "any"),
    position: String(formData.get("position") || "any"),
    slotsNeeded: Number(formData.get("slotsNeeded") || 1),
  };

  const teamId = String(formData.get("teamId") || "");
  if (teamId) body.teamId = teamId;

  if (postType === "opponent_request") {
    body.venue = String(formData.get("venue") || "");
    body.matchDate = String(formData.get("matchDate") || "");
    body.matchTime = String(formData.get("matchTime") || "");
    body.maxPlayers = Number(formData.get("maxPlayers") || 10);
  }

  const res = await apiFetch<Post>("/posts", {
    method: "POST",
    token: session.token,
    body,
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to create post" };
  }

  revalidatePath("/requests");
  revalidatePath("/organizer/requests");
  return { success: true, message: "Posted! Others can now find and apply to this." };
}

// ------------------------------------------------------------------ browse

export async function fetchOpenPostsAction(params: {
  postType?: PostType;
  city?: string;
  skillLevel?: string;
}) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const qs = new URLSearchParams();
  if (params.postType) qs.set("postType", params.postType);
  if (params.city) qs.set("city", params.city);
  if (params.skillLevel) qs.set("skillLevel", params.skillLevel);
  qs.set("excludeMine", "true");
  qs.set("limit", "20");
  return apiFetch<Post[]>(`/posts?${qs.toString()}`, { token: session.token });
}

export async function fetchMyPostsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Post[]>("/posts/mine", { token: session.token });
}

export async function fetchMyApplicationsAction() {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Application[]>("/posts/applications/mine", { token: session.token });
}

export async function fetchPostByIdAction(id: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Post>(`/posts/${id}`, { token: session.token });
}

export async function fetchApplicationsForPostAction(postId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  return apiFetch<Application[]>(`/posts/${postId}/applications`, { token: session.token });
}

// ------------------------------------------------------------------ manage

export async function closePostAction(postId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/posts/${postId}`, { method: "DELETE", token: session.token });
  revalidatePath("/requests");
  revalidatePath("/organizer/requests");
  return res;
}

export async function applyToPostAction(
  postId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }

  const teamId = String(formData.get("teamId") || "");
  const message = String(formData.get("message") || "");

  const res = await apiFetch("/posts/" + postId + "/apply", {
    method: "POST",
    token: session.token,
    body: {
      teamId: teamId || undefined,
      message: message || undefined,
    },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to apply" };
  }

  revalidatePath("/requests");
  revalidatePath("/organizer/requests");
  return { success: true, message: "Application submitted!" };
}

export async function withdrawApplicationAction(applicationId: string) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch(`/posts/applications/${applicationId}`, {
    method: "DELETE",
    token: session.token,
  });
  revalidatePath("/requests");
  revalidatePath("/organizer/requests");
  return res;
}

export async function reviewApplicationAction(
  applicationId: string,
  action: "accept" | "reject"
) {
  const session = await requireSession();
  if (!session) {
    return { success: false, message: "Please log in to continue" };
  }
  const res = await apiFetch<{ application: Application; matchId?: string }>(
    `/posts/applications/${applicationId}`,
    {
      method: "PATCH",
      token: session.token,
      body: { action },
    }
  );
  revalidatePath("/requests");
  revalidatePath("/organizer/requests");
  revalidatePath("/dashboard");
  return res;
}
