import { fetchFutsalsAction } from "@/lib/actions/player-actions";
import FutsalCard from "@/components/player/FutsalCard";

export default async function BrowseFutsalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const district = typeof query.district === "string" ? query.district : undefined;
  const search = typeof query.search === "string" ? query.search : undefined;
  const minPrice = typeof query.minPrice === "string" ? Number(query.minPrice) : undefined;
  const maxPrice = typeof query.maxPrice === "string" ? Number(query.maxPrice) : undefined;

  const res = await fetchFutsalsAction({ district, search, minPrice, maxPrice });
  const futsals = res.success ? res.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Book a Futsal</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse verified grounds near you and check prices, hours, and facilities.
        </p>
      </header>

      <div className="px-8 py-6">
        <form method="GET" className="flex flex-wrap items-center gap-3 mb-6">
          <input
            type="text"
            name="search"
            placeholder="Search by name"
            defaultValue={search}
            className="w-48 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            defaultValue={district}
            className="w-40 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Rs./hr"
            defaultValue={minPrice}
            className="w-32 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Rs./hr"
            defaultValue={maxPrice}
            className="w-32 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {!res.success ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {res.message || "Failed to load futsal grounds"}
          </div>
        ) : futsals.length === 0 ? (
          <div className="mt-8 text-sm text-gray-400 text-center max-w-md mx-auto">
            <p>No futsal grounds match those filters yet.</p>
            {!search && !district && !minPrice && !maxPrice && (
              <p className="mt-2 text-xs text-gray-400">
                Only grounds an admin has verified show up here. If an organizer just added
                one, it'll appear once it's approved.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {futsals.map((f) => (
              <FutsalCard key={f._id} futsal={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
