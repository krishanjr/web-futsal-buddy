"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthFormState } from "@/lib/actions/auth-actions";

const initialState: AuthFormState = { success: true };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.message && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
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
          placeholder="captain@collegiate.edu"
          autoComplete="email"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm mt-1"
      >
        {pending ? "Signing in…" : "Login"}
      </button>

      <p className="text-xs text-center text-gray-400">
        Admins and players both sign in here — you&apos;ll land on the right
        place automatically.
      </p>

      <div className="pt-3 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          New to the league?{" "}
          <Link
            href="/register"
            className="text-green-700 hover:text-green-900 font-medium transition-colors"
          >
            Create an Account →
          </Link>
        </p>
      </div>
    </form>
  );
}
