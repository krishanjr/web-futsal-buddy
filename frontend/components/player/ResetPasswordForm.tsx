"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuthClient } from "@/lib/firebase/client";
import { completePasswordResetAction } from "@/lib/actions/player-actions";

const hasFirebase =
  firebaseAuthClient && typeof (firebaseAuthClient as any).app !== "undefined";

type Status = "checking" | "invalid" | "ready" | "success";

export default function ResetPasswordForm({ oobCode }: { oobCode?: string }) {
  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    if (!hasFirebase) {
      setStatus("invalid");
      setError("Password reset is not configured.");
      return;
    }
    verifyPasswordResetCode(firebaseAuthClient, oobCode)
      .then((verifiedEmail: string) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!oobCode || !email) return;

    setPending(true);
    try {
      await confirmPasswordReset(firebaseAuthClient, oobCode, newPassword);

      const cred = await signInWithEmailAndPassword(firebaseAuthClient, email, newPassword);
      const idToken = await cred.user.getIdToken();

      const res = await completePasswordResetAction(idToken, newPassword);
      if (!res.success) {
        setError(res.message || "Failed to reset password");
        setPending(false);
        return;
      }
      setStatus("success");
    } catch (err: any) {
      setError(
        err?.code === "auth/weak-password"
          ? "Please choose a stronger password"
          : "Could not reset your password. The link may have expired — request a new one."
      );
      setPending(false);
    }
  }

  if (status === "checking") {
    return <p className="text-sm text-gray-500">Verifying your reset link…</p>;
  }

  if (status === "invalid") {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {error || (
          <>
            This reset link is invalid or has expired.{" "}
            <Link href="/forgot-password" className="font-medium underline">
              Request a new one
            </Link>
            .
          </>
        )}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
        Password reset successfully — you can now log in.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      <Field id="newPassword" label="New Password" />
      <Field id="confirmPassword" label="Confirm New Password" />
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        {pending ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}

function Field({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="password"
        required
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
