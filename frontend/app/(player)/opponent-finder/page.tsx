import { fetchOpponentsAction, fetchOpenMatchesAction, fetchTeamsAction, joinMatchAction, leaveMatchAction } from "@/lib/actions/player-actions";
import PlayerCard from "@/components/player/PlayerCard";
import FinderFilters from "@/components/player/FinderFilters";
import JoinMatchButton from "@/components/player/JoinMatchButton";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export default async function OpponentFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const city = typeof query.city === "string" ? query.city : undefined;
  const position = typeof query.position === "string" ? query.position : undefined;
  const skillLevel = typeof query.skillLevel === "string" ? query.skillLevel : undefined;

  const [opponentsRes, matchesRes, teamsRes, session] = await Promise.all([
    fetchOpponentsAction({ city, position, skillLevel }),
    fetchOpenMatchesAction({ city, skillLevel, status: "open" }),
    fetchTeamsAction({ city }),
    getSession(),
  ]);

  const opponents = opponentsRes.success ? opponentsRes.data || [] : [];
  const matches = matchesRes.success ? matchesRes.data || [] : [];
  const teams = teamsRes.success ? teamsRes.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Opponent Finder</h1>
        <p className="text-sm text-gray-500 mt-1">
          Find the perfect match for your team this weekend.
        </p>
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Open Matches</h2>
          {!matchesRes.success ? (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {matchesRes.message || "Failed to load matches"}
            </div>
          ) : matches.length === 0 ? (
            <p className="text-sm text-gray-400 py-6">No open matches found nearby.</p>
          ) : (
            <div className="flex flex-col gap-3 mb-8">
              {matches.map((m) => {
                const joined = session ? m.players.includes(session.user._id) : false;
                return (
                  <div
                    key={m._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{m.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {m.venue}, {m.city} · {m.matchDate}, {m.matchTime}
                      </p>
                      <span className="inline-block mt-2 text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                        {m.matchType}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-2">
                        {m.players.length}/{m.maxPlayers} players
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/matches/${m._id}`}
                          className="text-xs font-medium text-gray-500 hover:text-green-700 transition-colors"
                        >
                          View Lobby
                        </Link>
                        <JoinMatchButton
                          matchId={m._id}
                          joined={joined}
                          full={m.status === "full" && !joined}
                          joinAction={joinMatchAction}
                          leaveAction={leaveMatchAction}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="text-sm font-semibold text-gray-700 mb-3">Teams Looking for a Match</h2>
          {!teamsRes.success ? (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {teamsRes.message || "Failed to load teams"}
            </div>
          ) : teams.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No teams found nearby yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {teams.map((t) => (
                <div
                  key={t._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.city} · {t.members.length}/{t.maxMembers} players
                    </p>
                  </div>
                  <Link
                    href={`/challenges/send/${t._id}`}
                    className="text-xs font-medium bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Challenge
                  </Link>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Players Looking for Opponents
          </h2>
          <FinderFilters
            type="skillLevel"
            typeOptions={["beginner", "intermediate", "advanced", "professional"]}
          />
          {!opponentsRes.success ? (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {opponentsRes.message || "Failed to load opponents"}
            </div>
          ) : opponents.length === 0 ? (
            <p className="mt-6 text-sm text-gray-400 text-center">
              No opponents match those filters yet.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {opponents.map((p) => (
                <PlayerCard key={p._id} player={p} ctaLabel="View Profile" />
              ))}
            </div>
          )}
        </div>

        <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 h-fit">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tips</h3>
          <ul className="text-xs text-gray-500 flex flex-col gap-2 list-disc pl-4">
            <li>Filter by skill level to find an evenly matched game.</li>
            <li>Join an open match directly, or challenge a player looking for opponents.</li>
            <li>Ask the AI Assistant for tactical tips before kickoff.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
