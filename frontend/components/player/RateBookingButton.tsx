"use client";

import { useActionState, useState } from "react";
import { createReviewAction, ActionResult } from "@/lib/actions/review-actions";

const initialState: ActionResult = { success: true };

export default function RateBookingButton({ bookingId }: { bookingId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const boundAction = createReviewAction.bind(null, bookingId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.success && state.message) {
    return <span className="text-xs text-green-700">✓ Rated</span>;
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors"
      >
        Rate ★
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-base leading-none ${n <= rating ? "text-amber-500" : "text-gray-200"}`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={pending || rating === 0}
        className="text-xs font-medium text-green-700 hover:text-green-900 disabled:opacity-40 transition-colors"
      >
        {pending ? "…" : "Submit"}
      </button>
      {state.message && !state.success && (
        <span className="text-xs text-red-600">{state.message}</span>
      )}
    </form>
  );
}
