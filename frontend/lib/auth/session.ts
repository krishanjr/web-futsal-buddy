import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "fb_session";

export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "player" | "organizer" | "admin";
  isActive: boolean;
  isVerified: boolean;
}

export interface Session {
  token: string;
  user: SessionUser;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}
