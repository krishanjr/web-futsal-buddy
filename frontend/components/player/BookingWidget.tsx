"use client";

import { useActionState, useState, useTransition } from "react";
import { createBookingAction, fetchAvailabilityAction } from "@/lib/actions/player-actions";
import { AvailabilitySlot } from "@/lib/types";

const initialState = { success: true, message: undefined as string | undefined };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingWidget({ futsalId }: { futsalId: string }) {
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);
  const [slotNotice, setSlotNotice] = useState<string | null>(null);
  const [loading, startLoading] = useTransition();
  const boundAction = createBookingAction;
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  function loadAvailability(nextDate: string) {
    setDate(nextDate);
    setSelected(null);
    setSlotNotice(null);
    startLoading(async () => {
      const res = await fetchAvailabilityAction(futsalId, nextDate);
      if (res.success && res.data) {
        setBlocked(res.data.blocked);
        setSlots(res.data.slots);
      } else {
        setBlocked(false);
        setSlots([]);
      }
    });
  }

  function handleSlotClick(s: AvailabilitySlot) {
    if (s.status === "booked") {
      setSlotNotice(`The ${s.start}–${s.end} slot is already booked. Pick another time.`);
      return;
    }
    setSlotNotice(null);
    setSelected(s);
  }

  const allBooked = slots !== null && slots.length > 0 && slots.every((s) => s.status === "booked");

  return (
    <div className="flex flex-col gap-3">
      {state.message && (
        <div
          className={`text-sm px-3 py-2 rounded-lg border ${
            state.success
              ? "text-green-700 bg-green-50 border-green-100"
              : "text-red-700 bg-red-50 border-red-100"
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="booking-date" className="text-xs text-gray-500">
          Pick a date
        </label>
        <input
          id="booking-date"
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => loadAvailability(e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <p className="text-xs text-gray-400">Loading available slots…</p>
      ) : slots === null ? (
        <button
          type="button"
          onClick={() => loadAvailability(date)}
          className="text-xs text-green-700 hover:underline self-start"
        >
          Check availability for {date}
        </button>
      ) : blocked ? (
        <p className="text-xs text-red-600">This ground is closed (holiday) on this date.</p>
      ) : slots.length === 0 ? (
        <p className="text-xs text-gray-400">No slots found.</p>
      ) : (
        <>
          {allBooked && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              This futsal is already booked for every slot on {date}. Try another date.
            </p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s.start}
                type="button"
                title={s.status === "booked" ? "Already booked" : undefined}
                onClick={() => handleSlotClick(s)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors ${
                  s.status === "booked"
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                    : selected?.start === s.start
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-700 border-gray-200 hover:border-green-400"
                }`}
              >
                {s.start}
              </button>
            ))}
          </div>
          {slotNotice && <p className="text-xs text-red-600">{slotNotice}</p>}
          {!allBooked && (
            <p className="text-[11px] text-gray-400">
              Grayed-out, struck-through times are already booked.
            </p>
          )}
        </>
      )}

      {selected && (
        <form action={formAction} className="mt-1 flex flex-col gap-2">
          <input type="hidden" name="futsalId" value={futsalId} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="startTime" value={selected.start} />
          <input type="hidden" name="endTime" value={selected.end} />
          <p className="text-xs text-gray-500">
            Booking {date}, {selected.start}–{selected.end}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="w-full px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
          >
            {pending ? "Booking…" : "Confirm Booking"}
          </button>
        </form>
      )}
    </div>
  );
}
