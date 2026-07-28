"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  acceptChallengeAction,
  rejectChallengeAction,
  withdrawChallengeAction,
} from "@/lib/actions/challenge-actions";

export function ReceivedChallengeActions({ challengeId }: { challengeId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void acceptChallengeAction(challengeId);
          })
        }
        className="text-xs font-medium text-green-700 hover:text-green-900 disabled:opacity-50 transition-colors"
      >
        Accept
      </button>
      <Link
        href={`/challenges/counter/${challengeId}`}
        className="text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors"
      >
        Counter Offer
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void rejectChallengeAction(challengeId);
          })
        }
        className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
      >
        Reject
      </button>
    </div>
  );
}

export function WithdrawChallengeButton({ challengeId }: { challengeId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void withdrawChallengeAction(challengeId);
        })
      }
      className="text-xs font-medium text-gray-500 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "Withdrawing…" : "Withdraw"}
    </button>
  );
}
