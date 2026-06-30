import Link from "next/link";
import { fetchTeamsAction } from "@/lib/actions/admin-team-actions";
import SearchBar from "@/components/admin/SearchBar";
import Pagination from "@/components/admin/Pagination";
import TeamsTable from "./_components/TeamsTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const size = query.size ? parseInt(query.size as string, 10) : 10;
  const search = query.search ? decodeURIComponent(query.search as string) : undefined;

  const res = await fetchTeamsAction({ page, size, search });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all futsal teams.</p>
        </div>
        <Link
          href="/admin/teams/create"
          className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors"
        >
          + New Team
        </Link>
      </div>

      <div className="mt-5">
        <SearchBar placeholder="Search team name or city…" defaultValue={search} />
      </div>

      {!res.success || !res.data ? (
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load teams"}
        </div>
      ) : (
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <TeamsTable teams={res.data.teams} />
          <div className="border-t border-gray-100 px-4">
            <Pagination basePath="/admin/teams" pagination={res.data.pagination} search={search} />
          </div>
        </div>
      )}
    </div>
  );
}
