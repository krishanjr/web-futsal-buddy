import Link from "next/link";
import { fetchAdminReportsAction } from "@/lib/actions/admin-report-actions";
import Pagination from "@/components/admin/Pagination";
import ReportActions from "./_components/ReportActions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const status = typeof query.status === "string" ? query.status : "pending";

  const res = await fetchAdminReportsAction({ page, size: 10, status });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reported Users</h1>
      <p className="text-sm text-gray-500 mt-1">Fair-play reports filed by players and organizers.</p>

      <div className="flex flex-wrap items-center gap-2 mt-5">
        {["pending", "resolved", "dismissed"].map((s) => (
          <Link
            key={s}
            href={`/admin/reports?status=${s}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition-colors ${
              status === s
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {!res.success || !res.data ? (
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load reports"}
        </div>
      ) : (
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {res.data.reports.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No reports found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 font-medium">Filed</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {res.data.reports.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-gray-900 max-w-md">{r.reason}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-600">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {r.status === "pending" ? (
                        <ReportActions reportId={r._id} />
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="border-t border-gray-100 px-4">
            <Pagination basePath="/admin/reports" pagination={res.data.pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
