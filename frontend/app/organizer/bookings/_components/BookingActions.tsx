"use client";

import { useState, useTransition } from "react";
import {
  approveBookingAction,
  rejectBookingAction,
  rescheduleBookingAction,
} from "@/lib/actions/organizer-booking-actions";

export default function BookingActions({
  bookingId,
  currentDate,
  currentStart,
  currentEnd,
  showApproveReject = true,
}: {
  bookingId: string;
  currentDate: string;
  currentStart: string;
  currentEnd: string;
  showApproveReject?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState(currentDate);
  const [startTime, setStartTime] = useState(currentStart);
  const [endTime, setEndTime] = useState(currentEnd);
  const [error, setError] = useState<string | null>(null);

  if (rescheduling) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-gray-200"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-gray-200 w-20"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-gray-200 w-20"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const res = await rescheduleBookingAction(bookingId, { date, startTime, endTime });
                if (!res.success) {
                  setError(res.message || "Failed to reschedule");
                } else {
                  setRescheduling(false);
                }
              })
            }
            className="text-xs font-medium text-green-700 hover:text-green-900 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setRescheduling(false)}
            className="text-xs font-medium text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {showApproveReject && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => approveBookingAction(bookingId))}
          className="text-xs font-medium text-green-700 hover:text-green-900 disabled:opacity-50 transition-colors"
        >
          Approve
        </button>
      )}
      <button
        type="button"
        onClick={() => setRescheduling(true)}
        className="text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors"
      >
        Reschedule
      </button>
      {showApproveReject && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => rejectBookingAction(bookingId))}
          className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
        >
          Reject
        </button>
      )}
    </div>
  );
}
