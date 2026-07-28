"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ActionResult } from "@/lib/actions/organizer-futsal-actions";
import { Futsal, FUTSAL_FACILITIES } from "@/lib/types";

const initialState: ActionResult = { success: true };

export default function OrganizerFutsalForm({
  futsal,
  action,
}: {
  futsal?: Futsal;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-2xl">
      {state.message && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
        </div>
      )}

      <Field id="name" label="Futsal Name" defaultValue={futsal?.name} required />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={futsal?.description}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="district" label="District" defaultValue={futsal?.district} required />
        <Field id="municipality" label="Municipality" defaultValue={futsal?.municipality} />
      </div>

      <Field id="nearbyLandmark" label="Nearby Landmark" defaultValue={futsal?.nearbyLandmark} />

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="latitude"
          label="Latitude"
          type="number"
          defaultValue={futsal ? String(futsal.latitude) : ""}
          required
        />
        <Field
          id="longitude"
          label="Longitude"
          type="number"
          defaultValue={futsal ? String(futsal.longitude) : ""}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="contactNumber" label="Contact Number" defaultValue={futsal?.contactNumber} required />
        <Field
          id="pricePerHour"
          label="Price / Hour (Rs.)"
          type="number"
          defaultValue={futsal ? String(futsal.pricePerHour) : ""}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="openingTime"
          label="Opening Time"
          type="time"
          defaultValue={futsal?.openingTime || "06:00"}
          required
        />
        <Field
          id="closingTime"
          label="Closing Time"
          type="time"
          defaultValue={futsal?.closingTime || "22:00"}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Facilities</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {FUTSAL_FACILITIES.map((facility) => (
            <label
              key={facility}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <input
                type="checkbox"
                name="facilities"
                value={facility}
                defaultChecked={futsal?.facilities?.includes(facility)}
                className="rounded border-gray-300 text-green-600"
              />
              {facility}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {pending ? "Saving…" : futsal ? "Save Changes" : "Create Futsal Profile"}
        </button>
        <Link href="/organizer/futsals" className="text-sm text-gray-500 hover:text-gray-700">
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
        step={type === "number" ? "any" : undefined}
        defaultValue={defaultValue}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
