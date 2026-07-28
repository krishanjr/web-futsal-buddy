"use server";

import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export async function fileReportAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await requireSession();

  const reportedUsername = String(formData.get("reportedUsername") || "").trim();
  const reason = String(formData.get("reason") || "").trim();

  if (!reportedUsername || !reason) {
    return { success: false, message: "Username and reason are required" };
  }

  const res = await apiFetch("/reports", {
    method: "POST",
    token: session.token,
    body: { reportedUsername, reason },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Failed to submit report" };
  }

  return { success: true, message: "Report submitted — our team will review it." };
}
