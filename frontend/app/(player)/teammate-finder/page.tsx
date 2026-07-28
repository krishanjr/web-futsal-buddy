import { fetchTeammatesAction } from "@/lib/actions/player-actions";
import PlayerCard from "@/components/player/PlayerCard";
import FinderFilters from "@/components/player/FinderFilters";

export default async function TeammateFinderPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const city = typeof query.city === "string" ? query.city : undefined;
  const position = typeof query.position === "string" ? query.position : undefined;
  const skillLevel = typeof query.skillLevel === "string" ? query.skillLevel : undefined;

  const res = await fetchTeammatesAction({ city, position, skillLevel });
  const players = res.success ? res.data || [] : [];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Teammate Finder</h1>
        <p className="text-sm text-gray-500 mt-1">
          Find the perfect addition to your squad.
        </p>
      </header>

      <div className="px-8 py-6">
        <FinderFilters
          type="position"
          typeOptions={["goalkeeper", "defender", "midfielder", "forward", "any"]}
        />

        {!res.success ? (
          <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {res.message || "Failed to load teammates"}
          </div>
        ) : players.length === 0 ? (
          <p className="mt-10 text-sm text-gray-400 text-center">
            No teammates match those filters yet. Try widening your search.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {players.map((p) => (
              <PlayerCard key={p._id} player={p} ctaLabel="View Profile" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
