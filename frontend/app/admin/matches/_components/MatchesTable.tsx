import Link from "next/link";
import { AdminMatch } from "@/lib/types";
import { deleteMatchAction } from "@/lib/actions/admin-match-actions";
import DeleteButton from "@/components/admin/DeleteButton";

const statusColors: Record<string, string> = {
  open: "bg-green-50 text-green-700",
  full: "bg-amber-50 text-amber-700",
  ongoing: "bg-blue-50 text-blue-700",
  completed: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-700",
};

export default function MatchesTable({ matches }: { matches: AdminMatch[] }) {
  if (matches.length === 0) {
    return <p className="px-5 py-8 text-sm text-gray-400 text-center">No matches found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
          <th className="px-5 py-3 font-medium">Title</th>
          <th className="px-5 py-3 font-medium">Venue / City</th>
          <th className="px-5 py-3 font-medium">Date</th>
          <th className="px-5 py-3 font-medium">Players</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((m) => (
          <tr key={m._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <td className="px-5 py-3 font-medium text-gray-900">{m.title}</td>
            <td className="px-5 py-3 text-gray-600">
              {m.venue}, {m.city}
            </td>
            <td className="px-5 py-3 text-gray-600">
              {m.matchDate} · {m.matchTime}
            </td>
            <td className="px-5 py-3 text-gray-600">
              {m.players.length} / {m.maxPlayers}
            </td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[m.status]}`}
              >
                {m.status}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href={`/admin/matches/${m._id}`}
                  className="text-xs font-medium text-gray-600 hover:text-green-800 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteMatchAction.bind(null, m._id)}
                  confirmText={`Delete match "${m.title}"? This cannot be undone.`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
