"use server";

import { apiFetch } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";

export async function fetchMyInsightsAction() {
  const session = await requireSession();
  return apiFetch<{
    insight: string;
    recommendations: string[];
  }>("/ai/my-insights", { token: session.token });
}

export async function askAiAction(question: string) {
  const session = await requireSession();
  return apiFetch<{ answer: string }>("/ai/ask", {
    method: "POST",
    token: session.token,
    body: { question },
  });
}
