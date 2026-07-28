"use client";

import { useActionState } from "react";
import { setFutsalHolidaysAction, ActionResult } from "@/lib/actions/organizer-futsal-actions";

const initialState: ActionResult = { success: true };

export default function FutsalHolidaysForm({
  futsalId,
  holidays,
}: {
  futsalId: string;
  holidays: string[];
}) {
  const boundAction = setFutsalHolidaysAction.bind(null, futsalId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
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
      <label className="text-sm font-medium text-gray-700">
        Blocked dates (YYYY-MM-DD, one per line)
      </label>
      <textarea
        name="holidays"
        rows={4}
        defaultValue={holidays.join("\n")}
        placeholder={"2026-07-20\n2026-08-15"}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <p className="text-xs text-gray-400">
        The ground will show as unavailable for booking on these full days.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-medium transition-colors"
      >
        {pending ? "Saving…" : "Save Blocked Dates"}
      </button>
    </form>
  );
}
