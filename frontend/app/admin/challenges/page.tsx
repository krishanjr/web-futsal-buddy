import { fetchAdminChallengesAction } from "@/lib/actions/admin-challenge-actions";
import Pagination from "@/components/admin/Pagination";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = query.page ? parseInt(query.page as string, 10) : 1;

  const res = await fetchAdminChallengesAction({ page, size: 10 });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>
      <p className="text-sm text-gray-500 mt-1">Team vs team match challenges across the platform.</p>

      {!res.success || !res.data ? (
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load challenges"}
        </div>
      ) : (
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {res.data.challenges.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No challenges yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Proposed Date</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {res.data.challenges.map((c) => (
                  <tr key={c._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-gray-900 font-medium">{c.proposedDate}</td>
                    <td className="px-5 py-3 text-gray-600">{c.proposedTime}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100 text-gray-600">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="border-t border-gray-100 px-4">
            <Pagination basePath="/admin/challenges" pagination={res.data.pagination} />
          </div>
        </div>
      )}
    </div>
  );
}
