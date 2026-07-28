"use client";

import { useActionState } from "react";
import { invitePlayerAction, ActionResult } from "@/lib/actions/player-team-actions";

const initialState: ActionResult = { success: true };

export default function InvitePlayerForm({ teamId }: { teamId: string }) {
  const boundAction = invitePlayerAction.bind(null, teamId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="flex items-end gap-2">
      <div className="flex-1 flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Invite by username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="e.g. rajesh99"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-medium transition-colors"
      >
        {pending ? "Sending…" : "Invite"}
      </button>
      {state.message && (
        <p className={`text-xs ${state.success ? "text-green-700" : "text-red-600"} ml-2`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
