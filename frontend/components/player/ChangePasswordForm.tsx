"use client";

import { useActionState } from "react";
import { changePasswordAction, ActionResult } from "@/lib/actions/player-actions";

const initialState: ActionResult = { success: true };

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <div
          className={`text-sm px-3 py-2 rounded-lg border ${
            state.success
              ? "text-green-700 bg-green-50 border-green-100"
              : "text-red-700 bg-red-50 border-red-100"
          }`}
        >
          {state.message}
        </div>
      )}
      <Field id="currentPassword" label="Current Password" />
      <Field id="newPassword" label="New Password" />
      <Field id="confirmPassword" label="Confirm New Password" />
      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
      >
        {pending ? "Changing…" : "Change Password"}
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
