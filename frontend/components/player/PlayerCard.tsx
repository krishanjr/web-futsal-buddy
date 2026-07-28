import Link from "next/link";
import { PlayerProfile } from "@/lib/types";

const skillColors: Record<string, string> = {
  beginner: "bg-gray-100 text-gray-600",
  intermediate: "bg-blue-50 text-blue-700",
  advanced: "bg-amber-50 text-amber-700",
  professional: "bg-green-50 text-green-700",
};

export default function PlayerCard({
  player,
  ctaLabel,
}: {
  player: PlayerProfile;
  ctaLabel: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-sm shrink-0">
            {player.position.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {player.position} · Age {player.age}
            </p>
            <p className="text-xs text-gray-500">{player.city}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full shrink-0 ${
            skillColors[player.skillLevel] || "bg-gray-100 text-gray-600"
          }`}
        >
          {player.skillLevel}
        </span>
      </div>

      {player.bio && (
        <p className="text-xs text-gray-500 line-clamp-2">&ldquo;{player.bio}&rdquo;</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{player.stats.matchesPlayed} matches</span>
        <span>{player.stats.wins} wins</span>
        <span>{player.stats.goals} goals</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400 capitalize">
          Preferred foot: {player.preferredFoot}
        </span>
        <Link
          href={`/players/${player._id}`}
          className="text-xs font-medium bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
