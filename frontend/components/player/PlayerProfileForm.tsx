"use client";

import { useActionState } from "react";
import { saveMyPlayerProfileAction, ActionResult } from "@/lib/actions/player-actions";
import { PlayerProfile } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function PlayerProfileForm({ profile }: { profile: PlayerProfile | null }) {
  const [state, formAction, pending] = useActionState(saveMyPlayerProfileAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      <input type="hidden" name="_exists" value={profile ? "1" : "0"} />

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
        <Select
          name="position"
          label="Position"
          defaultValue={profile?.position || "any"}
          options={["goalkeeper", "defender", "midfielder", "forward", "any"]}
        />
        <Select
          name="skillLevel"
          label="Skill Level"
          defaultValue={profile?.skillLevel || "beginner"}
          options={["beginner", "intermediate", "advanced", "professional"]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          name="preferredFoot"
          label="Preferred Foot"
          defaultValue={profile?.preferredFoot || "right"}
          options={["left", "right", "both"]}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Age</label>
          <input
            name="age"
            type="number"
            min={10}
            max={80}
            defaultValue={profile?.age ?? 18}
            required
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <input
          name="city"
          defaultValue={profile?.city}
          required
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <Select
        name="lookingFor"
        label="Looking For"
        defaultValue={profile?.lookingFor || "both"}
        options={["teammate", "opponent", "both"]}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={profile?.bio}
          className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isAvailable"
          defaultChecked={profile?.isAvailable ?? true}
          className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
        />
        Available to be found by other players
      </label>

      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Saving…" : profile ? "Save Changes" : "Create Player Profile"}
      </button>
    </form>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 capitalize focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
