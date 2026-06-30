import MatchForm from "../_components/MatchForm";
import { createMatchAction } from "@/lib/actions/admin-match-actions";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Match</h1>
      <p className="text-sm text-gray-500 mt-1">Schedule a new futsal match.</p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <MatchForm action={createMatchAction} />
      </div>
    </div>
  );
}
