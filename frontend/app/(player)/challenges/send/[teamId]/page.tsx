import Link from "next/link";
import { fetchMyPlayerTeamsAction } from "@/lib/actions/player-team-actions";
import { fetchFutsalsAction } from "@/lib/actions/player-actions";
import SendChallengeForm from "../../_components/SendChallengeForm";

export default async function Page({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const [teamsRes, futsalsRes] = await Promise.all([
    fetchMyPlayerTeamsAction(),
    fetchFutsalsAction({}),
  ]);

  const myTeams = teamsRes.success ? teamsRes.data || [] : [];
  const futsals = futsalsRes.success ? futsalsRes.data || [] : [];

  if (myTeams.length === 0) {
    return (
      <div className="min-h-screen px-8 py-6">
        <div className="text-sm text-gray-500 bg-white border border-gray-100 rounded-2xl p-6 max-w-md">
          You need to captain a team before you can send a challenge.{" "}
          <Link href="/my-team/create" className="text-green-700 hover:underline">
            Create your team first
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <Link href="/opponent-finder" className="text-xs text-gray-500 hover:text-green-700">
          ← Back to Opponent Finder
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Send Challenge</h1>
      </header>
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-lg">
          <SendChallengeForm opponentTeamId={teamId} myTeams={myTeams} futsals={futsals} />
        </div>
      </div>
    </div>
  );
}
