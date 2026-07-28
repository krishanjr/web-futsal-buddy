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

  redirect(roleHome(res.data.user.role));
}

export interface GoogleLoginResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
}

// Called from the client after a successful Firebase Google popup sign-in.
// We can't use `redirect()` here the way loginAction does, because this isn't
// invoked as a <form action> — it's called directly from a client component's
// onClick handler, which needs a normal return value to know where to send
// the user next.
export async function googleLoginAction(idToken: string): Promise<GoogleLoginResult> {
  const res = await apiFetch<{ user: Session["user"]; token: string }>(
    "/auth/google-login",
    { method: "POST", body: { idToken } }
  );

  if (!res.success || !res.data) {
    return { success: false, message: res.message || "Google sign-in failed" };
  }

  await setSessionCookie({ token: res.data.token, user: res.data.user });

  return { success: true, redirectTo: roleHome(res.data.user.role) };
}

function roleHome(role: string) {
  if (role === "admin") return "/admin";
  if (role === "organizer") return "/organizer";
  return "/dashboard";
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
  const role = String(formData.get("role") || "player") === "organizer" ? "organizer" : "player";

  if (!firstName || !lastName || !email || !username || !password) {
    return { success: false, message: "All fields are required" };
  }

  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: { firstName, lastName, email, username, password, role },
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
    redirect(roleHome(loginRes.data.user.role));
  }

  redirect("/login");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
