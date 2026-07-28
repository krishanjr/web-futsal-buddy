"use client";

import { useState, useTransition } from "react";

interface ActionResponse {
  success: boolean;
  message?: string;
}

interface Props {
  matchId: string;
  joined: boolean;
  full?: boolean;
  joinAction: (matchId: string) => Promise<ActionResponse>;
  leaveAction: (matchId: string) => Promise<ActionResponse>;
}

export default function JoinMatchButton({
  matchId,
  joined: initialJoined,
  full = false,
  joinAction,
  leaveAction,
}: Props) {
  const [joined, setJoined] = useState(initialJoined);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!joined && full) {
    return (
      <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400">
        Full
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            setError(null);
            const res = await (joined ? leaveAction(matchId) : joinAction(matchId));
            if (res.success) {
              setJoined((j) => !j);
            } else {
              setError(res.message || "Something went wrong");
            }
          });
        }}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
          joined
            ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700"
            : "bg-green-700 text-white hover:bg-green-800"
        }`}
      >
        {pending ? "…" : joined ? "Leave" : "Join"}
      </button>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}
