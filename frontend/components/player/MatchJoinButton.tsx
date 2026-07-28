"use client";

import { useTransition } from "react";
import { joinMatchAction, leaveMatchAction } from "@/lib/actions/player-actions";

export default function MatchJoinButton({
  matchId,
  joined,
  full,
}: {
  matchId: string;
  joined: boolean;
  full: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (joined) {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void leaveMatchAction(matchId);
          })
        }
        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "…" : "Leave"}
      </button>
    );
  }

  if (full) {
    return (
      <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400">
        Full
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void joinMatchAction(matchId);
        })
      }
      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white disabled:opacity-50 transition-colors"
    >
      {pending ? "…" : "Join"}
    </button>
  );
}
