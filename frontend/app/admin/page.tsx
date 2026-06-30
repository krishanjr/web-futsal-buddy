import Link from "next/link";
import { fetchDashboardAction } from "@/lib/actions/admin-dashboard-actions";

export default async function AdminDashboardPage() {
  const res = await fetchDashboardAction();

  if (!res.success || !res.data) {
    return (
      <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        {res.message || "Failed to load dashboard stats"}
      </div>
    );
  }

  const stats = res.data;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, href: "/admin/users" },
    { label: "Total Teams", value: stats.totalTeams, href: "/admin/teams" },
    { label: "Total Matches", value: stats.totalMatches, href: "/admin/matches" },
    { label: "Total Players", value: stats.totalPlayers, href: "/admin/users?role=player" },
    { label: "Open Matches", value: stats.openMatches, href: "/admin/matches" },
    { label: "Open Teams", value: stats.openTeams, href: "/admin/teams" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">
        Overview of the Futsal Buddy platform.
      </p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-green-200 transition-colors"
          >
            <p className="text-xs text-gray-400 font-medium">{c.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 font-medium mb-3">Users by Role</p>
        <div className="flex gap-6">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {stats.usersByRole.players}
            </p>
            <p className="text-xs text-gray-500">Players</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {stats.usersByRole.organizers}
            </p>
            <p className="text-xs text-gray-500">Organizers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {stats.usersByRole.admins}
            </p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
