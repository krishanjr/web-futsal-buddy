import Link from "next/link";
import { fetchAdminBookingsAction, cancelAdminBookingAction } from "@/lib/actions/admin-booking-actions";
import DeleteButton from "@/components/admin/DeleteButton";
import Pagination from "@/components/admin/Pagination";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const status = typeof query.status === "string" ? query.status : undefined;

  const res = await fetchAdminBookingsAction({ page, size: 10, status });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      <p className="text-sm text-gray-500 mt-1">All futsal bookings across the platform.</p>

      <div className="flex flex-wrap items-center gap-2 mt-5">
        {["pending", "approved", "rejected", "cancelled", "completed"].map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
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
          <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-gray-600">
            Clear
          </Link>
        )}
      </div>

      {!res.success || !res.data ? (
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load bookings"}
        </div>
      ) : (
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {res.data.bookings.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No bookings found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {res.data.bookings.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-gray-900 font-medium">{b.date}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {b.startTime}–{b.endTime}
                    </td>
                    <td className="px-5 py-3 text-gray-600">Rs. {b.price}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-600">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {b.status !== "cancelled" && (
                        <DeleteButton
                          action={cancelAdminBookingAction.bind(null, b._id)}
                          confirmText="Cancel this booking?"
                          label="Cancel"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="border-t border-gray-100 px-4">
            <Pagination basePath="/admin/bookings" pagination={res.data.pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
