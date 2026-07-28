"use client";

import { useActionState } from "react";
import { counterChallengeAction, ActionResult } from "@/lib/actions/challenge-actions";
import { Futsal } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function CounterChallengeForm({
  challengeId,
  futsals,
}: {
  challengeId: string;
  futsals: Futsal[];
}) {
  const boundAction = counterChallengeAction.bind(null, challengeId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

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

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="counterDate" className="text-sm font-medium text-gray-700">
            New Date
          </label>
          <input
            id="counterDate"
            name="counterDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="counterTime" className="text-sm font-medium text-gray-700">
            New Time
          </label>
          <input
            id="counterTime"
            name="counterTime"
            type="time"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="counterFutsalId" className="text-sm font-medium text-gray-700">
          Preferred Futsal (optional)
        </label>
        <select
          id="counterFutsalId"
          name="counterFutsalId"
          defaultValue=""
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">No preference</option>
          {futsals.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name} — {f.district}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Sending…" : "Send Counter Offer"}
      </button>
    </form>
  );
}
