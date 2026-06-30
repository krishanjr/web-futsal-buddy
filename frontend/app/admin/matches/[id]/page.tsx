import { fetchMatchByIdAction, updateMatchAction } from "@/lib/actions/admin-match-actions";
import MatchForm from "../_components/MatchForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchResponse = await fetchMatchByIdAction(id);

  if (!matchResponse.success) {
    throw new Error(matchResponse.message || "Failed to fetch match");
  }
  if (!matchResponse.data) {
    throw new Error("No match data available");
  }

  const boundAction = updateMatchAction.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Match</h1>
      <p className="text-sm text-gray-500 mt-1">Update match details.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <MatchForm match={matchResponse.data} action={boundAction} />
      </div>
    </div>
  );
}
