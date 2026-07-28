import Link from "next/link";
import {
  fetchOrganizerBookingsAction,
  fetchOrganizerEarningsAction,
} from "@/lib/actions/organizer-booking-actions";
import { fetchMyFutsalsAction } from "@/lib/actions/organizer-futsal-actions";
import BookingActions from "./_components/BookingActions";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
] as const;

export default async function OrganizerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const range = (typeof query.range === "string" ? query.range : "all") as
    | "today"
    | "week"
    | "month"
    | "all";
  const status = typeof query.status === "string" ? query.status : undefined;

  const [bookingsRes, earningsRes, futsalsRes] = await Promise.all([
    fetchOrganizerBookingsAction({ range, status }),
    fetchOrganizerEarningsAction(),
    fetchMyFutsalsAction(),
  ]);

  const bookings = bookingsRes.success ? bookingsRes.data || [] : [];
  const earnings = earningsRes.success ? earningsRes.data : undefined;
  const futsalNames = new Map((futsalsRes.data || []).map((f) => [f._id, f.name]));

  if (futsalsRes.success && (futsalsRes.data || []).length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-4 text-sm text-gray-400">
          You haven&apos;t added a futsal ground yet.{" "}
          <Link href="/organizer/futsals/create" className="text-green-700 hover:underline">
            Add one first
          </Link>{" "}
          to start receiving bookings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      <p className="text-sm text-gray-500 mt-1">
        Approve or reject booking requests for your grounds.
      </p>

      {earnings && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "Today's Revenue", value: earnings.today },
            { label: "This Week", value: earnings.week },
            { label: "This Month", value: earnings.month },
            { label: "Total Revenue", value: earnings.total },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">Rs. {c.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-6">
        {RANGES.map((r) => (
          <Link
            key={r.value}
            href={`/organizer/bookings?range=${r.value}${status ? `&status=${status}` : ""}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              range === r.value
                ? "bg-green-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {r.label}
          </Link>
        ))}
        <span className="w-px h-4 bg-gray-200 mx-1" />
        {["pending", "approved", "rejected", "cancelled"].map((s) => (
          <Link
            key={s}
            href={`/organizer/bookings?range=${range}&status=${s}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition-colors ${
              status === s
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </Link>
        ))}
        {status && (
          <Link
            href={`/organizer/bookings?range=${range}`}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </Link>
        )}
      </div>

      <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {!bookingsRes.success ? (
          <div className="p-5 text-sm text-red-700">{bookingsRes.message}</div>
        ) : bookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No bookings in this range.</p>
        ) : (
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
                  <td className="px-5 py-3 text-gray-900 font-medium">
                    {futsalNames.get(b.futsalId) || "—"}
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
                    {b.status === "pending" ? (
                      <BookingActions
                        bookingId={b._id}
                        currentDate={b.date}
                        currentStart={b.startTime}
                        currentEnd={b.endTime}
                      />
                    ) : b.status === "approved" ? (
                      <BookingActions
                        bookingId={b._id}
                        currentDate={b.date}
                        currentStart={b.startTime}
                        currentEnd={b.endTime}
                        showApproveReject={false}
                      />
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

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
