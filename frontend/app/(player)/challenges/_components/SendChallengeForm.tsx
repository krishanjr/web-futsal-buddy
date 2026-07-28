"use client";

import { useActionState } from "react";
import { sendChallengeAction, ActionResult } from "@/lib/actions/challenge-actions";
import { AdminTeam, Futsal } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function SendChallengeForm({
  opponentTeamId,
  myTeams,
  futsals,
}: {
  opponentTeamId: string;
  myTeams: AdminTeam[];
  futsals: Futsal[];
}) {
  const boundAction = sendChallengeAction.bind(null, opponentTeamId);
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

      <div className="flex flex-col gap-1">
        <label htmlFor="challengerTeamId" className="text-sm font-medium text-gray-700">
          Challenging with
        </label>
        <select
          id="challengerTeamId"
          name="challengerTeamId"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {myTeams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="proposedDate" className="text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="proposedDate"
            name="proposedDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="proposedTime" className="text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            id="proposedTime"
            name="proposedTime"
            type="time"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="preferredFutsalId" className="text-sm font-medium text-gray-700">
          Preferred Futsal (optional)
        </label>
        <select
          id="preferredFutsalId"
          name="preferredFutsalId"
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

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-gray-700">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Looking forward to a good game!"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Sending…" : "Send Challenge"}
      </button>
    </form>
  );
}
