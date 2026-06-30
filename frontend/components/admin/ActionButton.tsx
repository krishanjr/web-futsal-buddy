"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
  label: string;
  className?: string;
}

export default function ActionButton({ action, label, className }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => action())}
      className={
        className ||
        "text-xs font-medium text-gray-600 hover:text-green-800 disabled:opacity-50 transition-colors"
      }
    >
      {pending ? "…" : label}
    </button>
  );
}
