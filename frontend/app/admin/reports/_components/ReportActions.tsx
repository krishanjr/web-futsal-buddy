"use client";

import { useTransition } from "react";
import { resolveReportAction } from "@/lib/actions/admin-report-actions";

export default function ReportActions({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => resolveReportAction(reportId, "resolved"))}
        className="text-xs font-medium text-green-700 hover:text-green-900 disabled:opacity-50 transition-colors"
      >
        Resolve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => resolveReportAction(reportId, "dismissed"))}
        className="text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}
