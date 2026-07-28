import OrganizerTeamForm from "@/app/organizer/teams/_components/OrganizerTeamForm";
import { fetchPlayerTeamByIdAction, updatePlayerTeamAction } from "@/lib/actions/player-team-actions";
import InvitePlayerForm from "../_components/InvitePlayerForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetchPlayerTeamByIdAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="px-8 py-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg mx-8 mt-6">
        {res.message || "Team not found"}
      </div>
    );
  }

  const boundAction = updatePlayerTeamAction.bind(null, id);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">{res.data.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {res.data.members.length}/{res.data.maxMembers} members
        </p>
      </header>
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-lg mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Invite Players</h2>
          <InvitePlayerForm teamId={res.data._id} />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-lg">
          <OrganizerTeamForm team={res.data} action={boundAction} />
        </div>
      </div>
    </div>
  );
}
