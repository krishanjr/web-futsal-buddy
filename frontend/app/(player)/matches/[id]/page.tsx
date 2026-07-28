import Link from "next/link";
import { fetchMatchByIdAction, joinMatchAction, leaveMatchAction } from "@/lib/actions/player-actions";
import { getSession } from "@/lib/auth/session";
import JoinMatchButton from "@/components/player/JoinMatchButton";

function shortId(id: string) {
  return id.slice(-6);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [res, session] = await Promise.all([fetchMatchByIdAction(id), getSession()]);

  if (!res.success || !res.data) {
    return (
      <div className="px-8 py-6">
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Match not found"}
        </div>
        <Link href="/opponent-finder" className="text-sm text-green-700 mt-4 inline-block">
          ← Back to Opponent Finder
        </Link>
      </div>
    );
  }

  const m = res.data;
  const myId = session?.user._id;
  const joined = myId ? m.players.includes(myId) : false;
  const myTeam = myId ? (m.teamA.includes(myId) ? "A" : m.teamB.includes(myId) ? "B" : null) : null;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <Link href="/opponent-finder" className="text-xs text-gray-500 hover:text-green-700">
          ← Back to Opponent Finder
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{m.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {m.venue}, {m.city} · {m.matchDate}, {m.matchTime}
            </p>
          </div>
          <JoinMatchButton
            matchId={m._id}
            joined={joined}
            full={m.status === "full" && !joined}
            joinAction={joinMatchAction}
            leaveAction={leaveMatchAction}
          />
        </div>
      </header>

      <div className="px-8 py-6">
        {myTeam && (
          <div
            className={`mb-6 rounded-2xl p-5 text-center ${
              myTeam === "A" ? "bg-blue-50 border border-blue-100" : "bg-orange-50 border border-orange-100"
            }`}
          >
            <p className="text-xs text-gray-500">You've been assigned to</p>
            <p className={`text-2xl font-bold ${myTeam === "A" ? "text-blue-700" : "text-orange-700"}`}>
              Team {myTeam}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Teams are balanced by our ML player-strength model — good luck!
            </p>
          </div>
        )}

        {!m.teamsAssigned ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Lobby — {m.players.length}/{m.maxPlayers} joined
            </h2>
            {m.players.length === 0 ? (
              <p className="text-sm text-gray-400">No one has joined yet. Be the first!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {m.players.map((pid) => (
                  <span
                    key={pid}
                    className={`text-xs px-3 py-1.5 rounded-full ${
                      pid === myId ? "bg-green-700 text-white" : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {pid === myId ? "You" : `Player ${shortId(pid)}`}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Once the lobby fills up, teams are assigned automatically and balanced by skill.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-blue-800 mb-3">Team A</h2>
              <div className="flex flex-col gap-2">
                {m.teamA.map((pid) => (
                  <div
                    key={pid}
                    className={`text-sm px-3 py-2 rounded-lg ${
                      pid === myId ? "bg-blue-700 text-white font-medium" : "bg-white text-gray-700"
                    }`}
                  >
                    {pid === myId ? "You" : `Player ${shortId(pid)}`}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-orange-800 mb-3">Team B</h2>
              <div className="flex flex-col gap-2">
                {m.teamB.map((pid) => (
                  <div
                    key={pid}
                    className={`text-sm px-3 py-2 rounded-lg ${
                      pid === myId ? "bg-orange-600 text-white font-medium" : "bg-white text-gray-700"
                    }`}
                  >
                    {pid === myId ? "You" : `Player ${shortId(pid)}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
