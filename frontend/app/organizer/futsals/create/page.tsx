import OrganizerFutsalForm from "../_components/OrganizerFutsalForm";
import { createFutsalAction } from "@/lib/actions/organizer-futsal-actions";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Add Futsal Ground</h1>
      <p className="text-sm text-gray-500 mt-1">
        Set up your venue profile. An admin will verify it before it appears to players.
      </p>
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <OrganizerFutsalForm action={createFutsalAction} />
      </div>
    </div>
  );
}
