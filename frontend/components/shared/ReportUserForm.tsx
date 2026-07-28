"use client";

import { useActionState } from "react";
import { fileReportAction, ActionResult } from "@/lib/actions/report-actions";

const initialState: ActionResult = { success: true };

export default function ReportUserForm() {
  const [state, formAction, pending] = useActionState(fileReportAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
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
        <label htmlFor="reportedUsername" className="text-sm font-medium text-gray-700">
          Username of the person you're reporting
        </label>
        <input
          id="reportedUsername"
          name="reportedUsername"
          type="text"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="reason" className="text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={4}
          required
          placeholder="Describe what happened…"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
      >
        {pending ? "Submitting…" : "Submit Report"}
      </button>
    </form>
  );
}
