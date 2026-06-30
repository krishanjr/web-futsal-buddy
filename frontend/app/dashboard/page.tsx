import { getSession } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth-actions";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-green-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold">
            ⚽
          </div>
          <span className="font-semibold text-green-800 text-lg tracking-tight">
            Futsal Buddy
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Logout
          </button>
        </form>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Signed in as <span className="font-medium">{user?.email}</span> ·
          Role: <span className="capitalize">{user?.role}</span>
        </p>

        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600 text-sm">
            This is your player dashboard. Browse open matches, join teams,
            and track your stats here.
          </p>
        </div>
      </main>
    </div>
  );
}
