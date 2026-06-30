import TeamForm from "../_components/TeamForm";
import { createTeamAction } from "@/lib/actions/admin-team-actions";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Team</h1>
      <p className="text-sm text-gray-500 mt-1">Add a new futsal team.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <TeamForm action={createTeamAction} />
      </div>
    </div>
  );
}
