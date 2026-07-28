import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import {
  fetchOpenMatchesAction,
  fetchTeammatesAction,
  fetchMyPlayerProfileAction,
  fetchMyStrengthAction,
  joinMatchAction,
  leaveMatchAction,
} from "@/lib/actions/player-actions";
import JoinMatchButton from "@/components/player/JoinMatchButton";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  const [matchesRes, teammatesRes, profileRes, strengthRes] = await Promise.all([
    fetchOpenMatchesAction({ status: "open" }),
    fetchTeammatesAction({}),
    fetchMyPlayerProfileAction(),
    fetchMyStrengthAction(),
  ]);

  const matches = matchesRes.success ? matchesRes.data || [] : [];
  const teammates = teammatesRes.success ? (teammatesRes.data || []).slice(0, 3) : [];
  const profile = profileRes.success ? profileRes.data : null;
  const strength = strengthRes.success ? strengthRes.data : null;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="text-sm text-gray-500">Ready for your next match?</p>
        </div>
        <div className="flex items-center gap-3">
          {!profile && (
            <Link
              href="/profile"
              className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full"
            >
              Complete your player profile →
            </Link>
          )}
        </div>
      </header>

      <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats */}
          {profile && (
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Matches" value={profile.stats.matchesPlayed} />
              <StatCard label="Wins" value={profile.stats.wins} />
              <StatCard label="Goals" value={profile.stats.goals} />
              <StatCard label="Assists" value={profile.stats.assists} />
            </div>
          )}

          {/* Upcoming / open matches */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Open Matches Near You</h2>
              <Link
                href="/opponent-finder"
                className="text-xs font-medium text-green-700 hover:text-green-900"
              >
                View Schedule →
              </Link>
            </div>

            {matches.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                No open matches right now — check back soon or post your own request.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {matches.slice(0, 4).map((m) => {
                  const joined = user ? m.players.includes(user._id) : false;
                  return (
                    <div
                      key={m._id}
                      className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{m.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {m.venue}, {m.city} · {m.matchDate} at {m.matchTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">
                          {m.players.length}/{m.maxPlayers} players
                        </span>
                        <Link
                          href={`/matches/${m._id}`}
                          className="text-xs font-medium text-gray-400 hover:text-green-700"
                        >
                          Lobby
                        </Link>
                        <JoinMatchButton
                          matchId={m._id}
                          joined={joined}
                          joinAction={joinMatchAction}
                          leaveAction={leaveMatchAction}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Discover teammates */}
          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Discover Teammates</h2>
              <Link
                href="/teammate-finder"
                className="text-xs font-medium text-green-700 hover:text-green-900"
              >
                See all →
              </Link>
            </div>
            {teammates.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">
                No teammate matches yet — try broadening your player profile.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {teammates.map((p) => (
                  <div key={p._id} className="border border-gray-100 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-sm mb-2">
                      {p.position.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {p.position} · {p.city}
                    </p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                      {p.skillLevel} level
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recent activity / AI teaser */}
        <div className="flex flex-col gap-6">
          {strength && (
            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-gray-900">AI Strength Rating</h2>
                <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  ML model
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{strength.strength}<span className="text-base text-gray-400 font-normal">/100</span></p>
              <p className="text-xs text-gray-400 mt-2">
                Predicted by a trained regression model from your match stats — used to
                balance teams when you join an individual match.
              </p>
            </section>
          )}

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Account</h2>
            <div className="flex flex-col gap-2 text-sm">
              <Row label="Name" value={`${user?.firstName} ${user?.lastName}`} />
              <Row label="Email" value={user?.email || ""} />
              <Row label="Username" value={user?.username || ""} />
              <Row label="Role" value={user?.role || ""} capitalize />
            </div>
          </section>

          <section className="bg-green-700 text-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold mb-2">Ask the AI Assistant</h2>
            <p className="text-sm text-green-50 mb-4">
              Get instant tips on tactics, matchmaking, or training based on your profile.
            </p>
            <Link
              href="/ai-assistant"
              className="inline-block bg-white text-green-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Open AI Assistant →
            </Link>
          </section>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Looking for a team?</h2>
            <p className="text-sm text-gray-500 mb-4">
              Post it and let organizers come to you — or apply to a team that&apos;s
              already recruiting.
            </p>
            <Link
              href="/requests"
              className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Post a Request
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium text-gray-800 ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}
