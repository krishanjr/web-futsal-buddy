import Link from "next/link";
import { AdminTeam } from "@/lib/types";
import { deleteTeamAction } from "@/lib/actions/admin-team-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default function TeamsTable({ teams }: { teams: AdminTeam[] }) {
  if (teams.length === 0) {
    return <p className="px-5 py-8 text-sm text-gray-400 text-center">No teams found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
          <th className="px-5 py-3 font-medium">Name</th>
          <th className="px-5 py-3 font-medium">City</th>
          <th className="px-5 py-3 font-medium">Skill Level</th>
          <th className="px-5 py-3 font-medium">Members</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((t) => (
          <tr key={t._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <td className="px-5 py-3 font-medium text-gray-900">{t.name}</td>
            <td className="px-5 py-3 text-gray-600">{t.city}</td>
            <td className="px-5 py-3 text-gray-600 capitalize">{t.skillLevel}</td>
            <td className="px-5 py-3 text-gray-600">
              {t.members.length} / {t.maxMembers}
            </td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  t.isOpen ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.isOpen ? "Open" : "Closed"}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href={`/admin/teams/${t._id}`}
                  className="text-xs font-medium text-gray-600 hover:text-green-800 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton
                  action={deleteTeamAction.bind(null, t._id)}
                  confirmText={`Delete team "${t.name}"? This cannot be undone.`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
