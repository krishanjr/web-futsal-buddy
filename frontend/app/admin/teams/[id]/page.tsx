import { fetchTeamByIdAction, updateTeamAction } from "@/lib/actions/admin-team-actions";
import TeamForm from "../_components/TeamForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teamResponse = await fetchTeamByIdAction(id);

  if (!teamResponse.success) {
    throw new Error(teamResponse.message || "Failed to fetch team");
  }
  if (!teamResponse.data) {
    throw new Error("No team data available");
  }

  const boundAction = updateTeamAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Team</h1>
      <p className="text-sm text-gray-500 mt-1">Update team details.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <TeamForm team={teamResponse.data} action={boundAction} />
      </div>
    </div>
  );
}
