import Link from "next/link";
import { fetchFutsalByIdAction } from "@/lib/actions/player-actions";
import { fetchFutsalReviewsAction } from "@/lib/actions/review-actions";
import BookingWidget from "@/components/player/BookingWidget";

export default async function FutsalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchFutsalByIdAction(id);

  if (!res.success || !res.data) {
    return (
      <div className="px-8 py-6">
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Futsal not found"}
        </div>
        <Link href="/futsals" className="text-sm text-green-700 mt-4 inline-block">
          ← Back to grounds
        </Link>
      </div>
    );
  }

  const f = res.data;
  const reviewsRes = await fetchFutsalReviewsAction(id);
  const reviews = reviewsRes.success ? reviewsRes.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <Link href="/futsals" className="text-xs text-gray-500 hover:text-green-700">
          ← Back to grounds
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-xl font-bold text-gray-900">{f.name}</h1>
          {f.reviewCount > 0 && (
            <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              ★ {f.rating.toFixed(1)} ({f.reviewCount})
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {f.district}
          {f.municipality ? `, ${f.municipality}` : ""}
          {f.nearbyLandmark ? ` · near ${f.nearbyLandmark}` : ""}
        </p>
      </header>

      <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {f.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {f.images.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={f.name}
                  className="w-full h-40 object-cover rounded-xl border border-gray-100"
                />
              ))}
            </div>
          )}

          {f.description && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">About</h2>
              <p className="text-sm text-gray-600">{f.description}</p>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Facilities</h2>
            {f.facilities.length === 0 ? (
              <p className="text-sm text-gray-400">No facilities listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {f.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet — be the first to play and rate!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                    <span className="text-amber-500 text-sm">{"★".repeat(r.rating)}</span>
                    <span className="text-gray-200 text-sm">{"★".repeat(5 - r.rating)}</span>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 h-fit flex flex-col gap-3">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-bold text-gray-900">Rs. {f.pricePerHour} / hour</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Hours</p>
            <p className="text-sm text-gray-700">
              {f.openingTime} – {f.closingTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Contact</p>
            <p className="text-sm text-gray-700">{f.contactNumber}</p>
          </div>
          <div className="mt-2 pt-3 border-t border-gray-100">
            <BookingWidget futsalId={f._id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
