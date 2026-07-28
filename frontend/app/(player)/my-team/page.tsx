import OrganizerTeamForm from "@/app/organizer/teams/_components/OrganizerTeamForm";
import { createPlayerTeamAction } from "@/lib/actions/player-team-actions";

export default function Page() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Create Team</h1>
        <p className="text-sm text-gray-500 mt-1">You&apos;ll be the team captain.</p>
      </header>
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-lg">
          <OrganizerTeamForm action={createPlayerTeamAction} />
        </div>
      </div>
    </div>
  );
}
