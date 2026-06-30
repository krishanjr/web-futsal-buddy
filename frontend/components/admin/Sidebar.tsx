import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import { SessionUser } from "@/lib/auth/session";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👤" },
  { href: "/admin/teams", label: "Teams", icon: "🛡️" },
  { href: "/admin/matches", label: "Matches", icon: "⚽" },
];

export default function Sidebar({ user }: { user?: SessionUser }) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold">
          ⚽
        </div>
        <div>
          <p className="font-semibold text-green-800 text-sm leading-tight">
            Futsal Buddy
          </p>
          <p className="text-xs text-gray-400 leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-800 font-medium transition-colors"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <p className="px-3 text-xs text-gray-400 truncate">{user?.email}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left mt-1 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
