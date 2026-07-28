"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { firebaseAuthClient, googleProvider } from "@/lib/firebase/client";
import { googleLoginAction } from "@/lib/actions/auth-actions";

const hasFirebase =
  firebaseAuthClient && googleProvider && typeof (firebaseAuthClient as any).app !== "undefined";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!hasFirebase) {
      setError("Google sign-in is not configured.");
      return;
    }
    setError(null);
    setPending(true);
    try {
      const result = await signInWithPopup(firebaseAuthClient, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await googleLoginAction(idToken);
      if (!res.success) {
        setError(res.message || "Google sign-in failed");
        setPending(false);
        return;
      }
      router.push(res.redirectTo || "/dashboard");
      router.refresh();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Could not sign in with Google. Please try again.");
      }
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.6 6 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.6 6 29 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.5 2.1-7 2.1-5.2 0-9.6-3.4-11.3-8.1l-6.5 5C9.9 39.7 16.4 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6 5C40.6 35.5 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"
          />
        </svg>
        {pending ? "Signing in…" : "Continue with Google"}
      </button>
    </div>
  );
}
