"use client";

import { useTransition } from "react";
import { withdrawApplicationAction } from "@/lib/actions/post-actions";

export default function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void withdrawApplicationAction(applicationId);
        })
      }
      className="text-xs font-medium bg-gray-100 hover:bg-red-50 hover:text-red-700 disabled:opacity-60 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
    >
      {pending ? "…" : "Withdraw"}
    </button>
  );
}
