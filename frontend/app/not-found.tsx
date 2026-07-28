import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🥅</div>
        <h1 className="text-3xl font-bold text-gray-900">404: Off the Pitch</h1>
        <p className="text-sm text-gray-500 mt-2">
          Looks like this page got tackled out of bounds. Let&apos;s get you back in the game.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
