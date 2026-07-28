"use client";

import { useState, FormEvent } from "react";
import { forgotPasswordAction, verifyResetOtpAction } from "@/lib/actions/player-actions";

type Step = "email" | "code" | "done";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submittedEmail = String(new FormData(e.currentTarget).get("email") || "").trim();
    if (!submittedEmail) return;

    setPending(true);
    setError(null);
    const res = await forgotPasswordAction(submittedEmail);
    setPending(false);

    setEmail(submittedEmail);
    setInfo(res.message || "If that email exists, a reset code has been sent.");
    setStep("code");
  }

  async function handleCodeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = String(formData.get("otp") || "").trim();
    const newPassword = String(formData.get("newPassword") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    setError(null);

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setPending(true);
    const res = await verifyResetOtpAction(email, otp, newPassword);
    setPending(false);

    if (!res.success) {
      setError(res.message || "Failed to reset password");
      return;
    }
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
        Password reset successfully — you can now log in.
      </div>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
        {info && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
            {info}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        <Field id="otp" label="6-digit code" type="text" maxLength={6} inputMode="numeric" />
        <Field id="newPassword" label="New Password" type="password" />
        <Field id="confirmPassword" label="Confirm New Password" type="password" />
        <button
          type="submit"
          disabled={pending}
          className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          {pending ? "Resetting…" : "Reset Password"}
        </button>
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-xs text-gray-400 hover:text-gray-600 self-center"
        >
          ← Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="captain@collegiate.edu"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        {pending ? "Sending…" : "Send Reset Code"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  maxLength,
  inputMode,
}: {
  id: string;
  label: string;
  type: string;
  maxLength?: number;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        maxLength={maxLength}
        inputMode={inputMode}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
