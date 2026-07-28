import { fetchAnalyticsAction } from "@/lib/actions/admin-analytics-actions";
import BarChart from "@/components/admin/BarChart";

export default async function Page() {
  const res = await fetchAnalyticsAction();

  if (!res.success || !res.data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load analytics"}
        </div>
      </div>
    );
  }

  const a = res.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <p className="text-sm text-gray-500 mt-1">Platform performance at a glance.</p>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mt-5 max-w-xs">
        <p className="text-xs text-gray-400">Total Revenue (all-time)</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">Rs. {a.totalRevenue}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Most Booked Futsals</h2>
          <BarChart
            data={a.mostBookedFutsals.map((f) => ({ label: f.name, count: f.count }))}
            labelKey="label"
            valueKey="count"
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Most Active Players (by bookings)
          </h2>
          {a.mostActivePlayers.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {a.mostActivePlayers.map((p, i) => (
                <div
                  key={p.playerId}
                  className="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0"
                >
                  <span className="text-gray-600">#{i + 1} Player {p.playerId.slice(-6)}</span>
                  <span className="font-medium text-gray-900">{p.count} bookings</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Month</h2>
          <BarChart
            data={a.revenueByMonth.map((r) => ({ label: r.month, revenue: r.revenue }))}
            labelKey="label"
            valueKey="revenue"
            valuePrefix="Rs. "
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">User Growth by Month</h2>
          <BarChart
            data={a.userGrowthByMonth.map((u) => ({ label: u.month, count: u.count }))}
            labelKey="label"
            valueKey="count"
          />
        </div>
      </div>
    </div>
  );
}
