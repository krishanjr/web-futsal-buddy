import OrganizerTeamForm from "./_components/OrganizerTeamForm";
import { createOrganizerTeamAction } from "@/lib/actions/organizer-team-actions";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Team</h1>
      <p className="text-sm text-gray-500 mt-1">Set up a new team roster.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <OrganizerTeamForm action={createOrganizerTeamAction} />
      </div>
    </div>
  );
}
