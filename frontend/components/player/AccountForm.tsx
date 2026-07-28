"use client";

import { useActionState } from "react";
import { updateMyAccountAction, ActionResult } from "@/lib/actions/player-actions";

const initialState: ActionResult = { success: true };

export default function AccountForm({
  firstName,
  lastName,
}: {
  firstName?: string;
  lastName?: string;
}) {
  const [state, formAction, pending] = useActionState(updateMyAccountAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-md">
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <input
            name="firstName"
            defaultValue={firstName}
            required
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            name="lastName"
            defaultValue={lastName}
            required
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
