import Link from "next/link";
import { fetchMyBookingsAction, fetchFutsalByIdAction } from "@/lib/actions/player-actions";
import DeleteButton from "@/components/admin/DeleteButton";
import { cancelBookingAction } from "@/lib/actions/player-actions";
import RateBookingButton from "@/components/player/RateBookingButton";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
    completed: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export default async function MyBookingsPage() {
  const res = await fetchMyBookingsAction();
  const bookings = res.success ? res.data || [] : [];

  const uniqueFutsalIds = Array.from(new Set(bookings.map((b) => b.futsalId)));
  const futsalResults = await Promise.all(uniqueFutsalIds.map((id) => fetchFutsalByIdAction(id)));
  const futsalNames = new Map(
    uniqueFutsalIds.map((id, i) => [id, futsalResults[i].data?.name || "Futsal"])
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Your futsal ground reservations.</p>
      </header>

      <div className="px-8 py-6">
        {!res.success ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {res.message}
          </div>
        ) : bookings.length === 0 ? (
          <p className="mt-8 text-sm text-gray-400 text-center">
            No bookings yet.{" "}
            <Link href="/futsals" className="text-green-700 hover:underline">
              Browse futsal grounds
            </Link>
            .
          </p>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Futsal</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {futsalNames.get(b.futsalId)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{b.date}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.startTime}–{b.endTime}
                    </td>
                    <td className="px-5 py-3 text-gray-600">Rs. {b.price}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {(b.status === "approved" || b.status === "completed") && (
                          <RateBookingButton bookingId={b._id} />
                        )}
                        {(b.status === "pending" || b.status === "approved") && (
                          <DeleteButton
                            action={cancelBookingAction.bind(null, b._id)}
                            confirmText="Cancel this booking?"
                            label="Cancel"
                          />
                        )}
                        {b.status !== "pending" &&
                          b.status !== "approved" &&
                          b.status !== "completed" && <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
