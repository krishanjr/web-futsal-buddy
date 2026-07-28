import { fetchAdminFutsalsAction } from "@/lib/actions/admin-futsal-actions";
import SearchBar from "@/components/admin/SearchBar";
import Pagination from "@/components/admin/Pagination";
import FutsalsTable from "./_components/FutsalsTable";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const size = query.size ? parseInt(query.size as string, 10) : 10;
  const search = query.search ? decodeURIComponent(query.search as string) : undefined;
  const isVerified =
    query.isVerified === "true" ? true : query.isVerified === "false" ? false : undefined;

  const res = await fetchAdminFutsalsAction({ page, size, search, isVerified });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Futsals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and verify futsal grounds submitted by organizers.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <SearchBar placeholder="Search futsal name…" defaultValue={search} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {[
          { label: "All", value: undefined },
          { label: "Pending Verification", value: "false" },
          { label: "Verified", value: "true" },
        ].map((f) => (
          <a
            key={f.label}
            href={`/admin/futsals${f.value !== undefined ? `?isVerified=${f.value}` : ""}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              (query.isVerified as string | undefined) === f.value
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {!res.success || !res.data ? (
        <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {res.message || "Failed to load futsals"}
        </div>
      ) : (
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <FutsalsTable futsals={res.data.futsals} />
          <div className="border-t border-gray-100 px-4">
            <Pagination basePath="/admin/futsals" pagination={res.data.pagination} search={search} />
          </div>
        </div>
      )}
    </div>
  );
}
