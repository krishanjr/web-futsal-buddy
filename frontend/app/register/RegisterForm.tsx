"use client";

import { useActionState } from "react";
import Link from "next/link";
import InputField from "@/components/InputField";
import { registerAction, AuthFormState } from "@/lib/actions/auth-actions";

const initialState: AuthFormState = { success: true };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.message && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="firstName"
          label="First Name"
          type="text"
          placeholder="Lionel"
          required
        />
        <InputField
          id="lastName"
          label="Last Name"
          type="text"
          placeholder="Messi"
          required
        />
      </div>

      <InputField
        id="email"
        label="Email Address"
        type="email"
        placeholder="captain@collegiate.edu"
        autoComplete="email"
        required
      />

      <InputField
        id="username"
        label="Username"
        type="text"
        placeholder="messi10"
        autoComplete="username"
        required
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        required
      />

      <p className="text-xs text-gray-400 -mt-2">
        New accounts join as Players by default. An admin can promote you to
        Organizer or Admin later.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm mt-1"
      >
        {pending ? "Creating account…" : "Create Account"}
      </button>

      <div className="pt-3 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Already on the roster?{" "}
          <Link
            href="/login"
            className="text-green-700 hover:text-green-900 font-medium transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </div>
    </form>
  );
}
