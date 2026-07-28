import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth-actions";
import { SessionUser } from "@/lib/auth/session";
import NotificationBell from "@/components/shared/NotificationBell";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/my-team", label: "My Team", icon: "🛡️" },
  { href: "/opponent-finder", label: "Find Opponent", icon: "⚔️" },
  { href: "/challenges", label: "Challenges", icon: "🔥" },
  { href: "/futsals", label: "Book Futsal", icon: "🏟️" },
  { href: "/bookings", label: "My Bookings", icon: "📅" },
  { href: "/requests", label: "Post & Apply", icon: "📝" },
  { href: "/teammate-finder", label: "Teammate Finder", icon: "🤝" },
  { href: "/ai-assistant", label: "AI Assistant", icon: "✨" },
  { href: "/report", label: "Report a User", icon: "🚩" },
  { href: "/profile", label: "Profile & Settings", icon: "⚙️" },
];

export default function PlayerSidebar({ user }: { user?: SessionUser }) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/futsal-buddy-logo.png" alt="Futsal Buddy" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-green-800 text-sm leading-tight">
              Futsal Buddy
            </p>
            <p className="text-xs text-gray-400 leading-tight">Collegiate League</p>
          </div>
        </Link>
        <NotificationBell />
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
        <p className="px-3 text-xs font-medium text-gray-700 truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="px-3 text-xs text-gray-400 truncate">{user?.email}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-left mt-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
