"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createUserAction, ActionResult } from "@/lib/actions/admin-user-actions";

const initialState: ActionResult = { success: true };

export default function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      {state.message && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field id="firstName" label="First Name" required />
        <Field id="lastName" label="Last Name" required />
      </div>

      <Field id="email" label="Email" type="email" required />
      <Field id="username" label="Username" required />
      <Field id="password" label="Password" type="password" required />

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="player"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="player">Player</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="isActive" defaultChecked className="rounded border-gray-300 text-green-600" />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="isVerified" className="rounded border-gray-300 text-green-600" />
          Verified
        </label>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {pending ? "Creating…" : "Create User"}
        </button>
        <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
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
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
    </div>
  );
}
