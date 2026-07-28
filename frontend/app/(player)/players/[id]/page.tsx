import Link from "next/link";
import { fetchPlayerProfileByIdAction } from "@/lib/actions/player-actions";

export default async function PlayerProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetchPlayerProfileByIdAction(id);
  if (!res.success || !res.data) {
    return (
      <main className="flex-1 px-8 py-8">
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3 max-w-lg">
          {res.message || "Player profile not found"}
        </div>
        <Link href="/dashboard" className="text-sm text-green-700 mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const p = res.data;

  return (
    <main className="flex-1 px-8 py-8 max-w-2xl">
      <Link href="/teammate-finder" className="text-sm text-green-700 hover:text-green-900">
        ← Back to search
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-lg">
            {p.position.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">
              {p.position} Player
            </h1>
            <p className="text-sm text-gray-500">
              {p.city} · Age {p.age} · {p.preferredFoot}-footed
            </p>
          </div>
        </div>

        {p.bio && (
          <p className="text-sm text-gray-600 mt-4 border-t border-gray-50 pt-4">
            &ldquo;{p.bio}&rdquo;
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat label="Matches" value={p.stats.matchesPlayed} />
          <Stat label="Wins" value={p.stats.wins} />
          <Stat label="Losses" value={p.stats.losses} />
          <Stat label="Goals" value={p.stats.goals} />
          <Stat label="Assists" value={p.stats.assists} />
          <Stat label="Skill" value={p.skillLevel} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-xs font-medium capitalize px-3 py-1.5 rounded-full bg-green-50 text-green-700">
            Looking for {p.lookingFor}
          </span>
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              p.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {p.isAvailable ? "Available" : "Not available"}
          </span>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-gray-900 capitalize">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
