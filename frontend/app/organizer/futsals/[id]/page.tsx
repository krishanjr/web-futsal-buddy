import {
  fetchOrganizerFutsalByIdAction,
  updateFutsalAction,
} from "@/lib/actions/organizer-futsal-actions";
import OrganizerFutsalForm from "../_components/OrganizerFutsalForm";
import FutsalImagesForm from "../_components/FutsalImagesForm";
import FutsalHolidaysForm from "../_components/FutsalHolidaysForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const futsalResponse = await fetchOrganizerFutsalByIdAction(id);

  if (!futsalResponse.success) {
    throw new Error(futsalResponse.message || "Failed to fetch futsal");
  }
  if (!futsalResponse.data) {
    throw new Error("No futsal data available");
  }

  const futsal = futsalResponse.data;
  const boundAction = updateFutsalAction.bind(null, id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{futsal.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {futsal.isVerified
            ? "Verified — visible to players in search."
            : "Pending admin verification — not yet visible to players."}
        </p>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Details</h2>
        <OrganizerFutsalForm futsal={futsal} action={boundAction} />
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Photos</h2>
        <FutsalImagesForm futsalId={futsal._id} images={futsal.images} />
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Blocked Dates / Holidays</h2>
        <FutsalHolidaysForm futsalId={futsal._id} holidays={futsal.holidays} />
      </section>
    </div>
  );
}
