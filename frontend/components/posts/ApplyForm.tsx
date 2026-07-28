"use client";

import { useActionState, useState } from "react";
import { applyToPostAction, ActionResult } from "@/lib/actions/post-actions";
import { AdminTeam } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function ApplyForm({
  postId,
  myTeams,
}: {
  postId: string;
  myTeams?: AdminTeam[]; // provided when the applicant must pick one of their own teams
}) {
  const boundAction = applyToPostAction.bind(null, postId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [open, setOpen] = useState(false);

  if (state.message) {
    return (
      <div
        className={`text-xs px-3 py-2 rounded-lg ${
          state.success ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
        }`}
      >
        {state.message}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        Apply
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {myTeams && (
        <select
          name="teamId"
          required
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select your team…</option>
          {myTeams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      )}
      <textarea
        name="message"
        rows={2}
        placeholder="Add a short message (optional)"
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="text-xs font-medium bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          {pending ? "Submitting…" : "Submit Application"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
