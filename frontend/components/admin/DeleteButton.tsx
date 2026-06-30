"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  confirmText?: string;
  label?: string;
}

export default function DeleteButton({ action, confirmText, label }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText || "Are you sure you want to delete this? This cannot be undone.")) {
          startTransition(() => {
            action();
          });
        }
      }}
      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Deleting…" : label || "Delete"}
    </button>
  );
}
