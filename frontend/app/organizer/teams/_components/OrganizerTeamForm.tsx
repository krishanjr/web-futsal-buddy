"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ActionResult } from "@/lib/actions/organizer-team-actions";
import { AdminTeam } from "@/lib/types";
import SingleImageUploadField from "@/components/shared/SingleImageUploadField";

const initialState: ActionResult = { success: true };

export default function OrganizerTeamForm({
  team,
  action,
}: {
  team?: AdminTeam;
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

      <Field id="name" label="Team Name" defaultValue={team?.name} required />
      <Field id="city" label="City" defaultValue={team?.city} required />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={team?.description}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            defaultValue={team?.skillLevel || "mixed"}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <Field
          id="maxMembers"
          label="Max Members"
          type="number"
          defaultValue={String(team?.maxMembers ?? 10)}
          required
        />
      </div>

      <SingleImageUploadField name="logoUrl" label="Team Logo (optional)" defaultValue={team?.logoUrl} />

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="isOpen"
          defaultChecked={team?.isOpen ?? true}
          className="rounded border-gray-300 text-green-600"
        />
        Open for new members
      </label>

      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {pending ? "Saving…" : team ? "Save Changes" : "Create Team"}
        </button>
        <Link href="/organizer/teams" className="text-sm text-gray-500 hover:text-gray-700">
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
