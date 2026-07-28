"use client";

import { useTransition } from "react";

export default function CloseButton({ action }: { action: () => Promise<unknown> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm("Close this post? This can't be undone.")) return;
        startTransition(() => {
          void action();
        });
      }}
      className="text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-60"
    >
      {pending ? "Closing…" : "Close post"}
    </button>
  );
}
