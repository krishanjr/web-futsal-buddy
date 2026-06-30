import Link from "next/link";
import { AdminUser } from "@/lib/types";
import {
  deleteUserAction,
  toggleUserActiveAction,
} from "@/lib/actions/admin-user-actions";
import DeleteButton from "@/components/admin/DeleteButton";
import ActionButton from "@/components/admin/ActionButton";

const roleColors: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  organizer: "bg-blue-50 text-blue-700",
  player: "bg-green-50 text-green-700",
};

export default function UsersTable({ users }: { users: AdminUser[] }) {
  if (users.length === 0) {
    return <p className="px-5 py-8 text-sm text-gray-400 text-center">No users found.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
          <th className="px-5 py-3 font-medium">Name</th>
          <th className="px-5 py-3 font-medium">Email</th>
          <th className="px-5 py-3 font-medium">Role</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
            <td className="px-5 py-3">
              <p className="font-medium text-gray-900">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-xs text-gray-400">@{u.username}</p>
            </td>
            <td className="px-5 py-3 text-gray-600">{u.email}</td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role]}`}
              >
                {u.role}
              </span>
            </td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  u.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {u.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href={`/admin/users/${u._id}`}
                  className="text-xs font-medium text-gray-600 hover:text-green-800 transition-colors"
                >
                  Edit
                </Link>
                <ActionButton
                  action={toggleUserActiveAction.bind(null, u._id, !u.isActive)}
                  label={u.isActive ? "Deactivate" : "Activate"}
                />
                <DeleteButton
                  action={deleteUserAction.bind(null, u._id)}
                  confirmText={`Delete user ${u.email}? This cannot be undone.`}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
