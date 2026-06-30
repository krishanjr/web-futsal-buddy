"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { SESSION_COOKIE, Session } from "@/lib/auth/session";

export interface AuthFormState {
  success: boolean;
  message?: string;
}

async function setSessionCookie(session: Session) {
  const store = await cookies();
  store.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days, matches backend JWT expiry
  });
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  const res = await apiFetch<{ user: Session["user"]; token: string }>(
    "/auth/login",
    { method: "POST", body: { email, password } }
  );

  if (!res.success || !res.data) {
    return { success: false, message: res.message || "Login failed" };
  }

  await setSessionCookie({ token: res.data.token, user: res.data.user });

  redirect(res.data.user.role === "admin" ? "/admin" : "/dashboard");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!firstName || !lastName || !email || !username || !password) {
    return { success: false, message: "All fields are required" };
  }

  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: { firstName, lastName, email, username, password },
  });

  if (!res.success) {
    return { success: false, message: res.message || "Registration failed" };
  }

  // Auto-login after successful registration
  const loginRes = await apiFetch<{ user: Session["user"]; token: string }>(
    "/auth/login",
    { method: "POST", body: { email, password } }
  );

  if (loginRes.success && loginRes.data) {
    await setSessionCookie({
      token: loginRes.data.token,
      user: loginRes.data.user,
    });
    redirect("/dashboard");
  }

  redirect("/login");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
