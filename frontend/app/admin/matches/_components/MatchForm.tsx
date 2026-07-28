"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ActionResult } from "@/lib/actions/admin-user-actions";
import { AdminMatch } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function MatchForm({
  match,
  action,
}: {
  match?: AdminMatch;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      {state.message && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
        </div>
      )}

      <Field id="title" label="Match Title" defaultValue={match?.title} required />

      <div className="grid grid-cols-2 gap-3">
        <Field id="venue" label="Venue" defaultValue={match?.venue} required />
        <Field id="city" label="City" defaultValue={match?.city} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="matchDate" label="Date" type="date" defaultValue={match?.matchDate} required />
        <Field id="matchTime" label="Time" type="time" defaultValue={match?.matchTime} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="maxPlayers"
          label="Max Players"
          type="number"
          defaultValue={String(match?.maxPlayers ?? 10)}
          required
        />
        <Field
          id="entryFee"
          label="Entry Fee"
          type="number"
          defaultValue={String(match?.entryFee ?? 0)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="skillLevel" className="text-sm font-medium text-gray-700">
            Skill Level
          </label>
          <select
            id="skillLevel"
            name="skillLevel"
            defaultValue={match?.skillLevel || "any"}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="any">Any</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="matchType" className="text-sm font-medium text-gray-700">
            Match Type
          </label>
          <select
            id="matchType"
            name="matchType"
            defaultValue={match?.matchType || "friendly"}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="friendly">Friendly</option>
            <option value="competitive">Competitive</option>
            <option value="tournament">Tournament</option>
          </select>
        </div>
      </div>

      {match && (
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={match.status}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="open">Open</option>
            <option value="full">Full</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

      {!match && (
        <div className="flex flex-col gap-1">
          <label htmlFor="organizerId" className="text-sm font-medium text-gray-700">
            Organizer User ID (optional)
          </label>
          <input
            id="organizerId"
            name="organizerId"
            placeholder="Defaults to your admin account"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={match?.description}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {pending ? "Saving…" : match ? "Save Changes" : "Create Match"}
        </button>
        <Link href="/admin/matches" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  required,
  type = "text",
}: {
  id: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
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
        defaultValue={defaultValue}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
