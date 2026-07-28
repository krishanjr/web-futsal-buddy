import Link from "next/link";
import { PaginationMeta } from "@/lib/types";

interface Props {
  basePath: string;
  pagination: PaginationMeta;
  search?: string;
}

function buildHref(basePath: string, page: number, size: number, search?: string) {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("size", String(size));
  if (search) qs.set("search", encodeURIComponent(search));
  return `${basePath}?${qs.toString()}`;
}

export default function Pagination({ basePath, pagination, search }: Props) {
  const { page, size, totalPages, total } = pagination;

  if (totalPages <= 1) {
    return (
      <p className="text-xs text-gray-400 px-1 py-3">{total} result(s)</p>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-xs text-gray-400">
        Page {page} of {totalPages} · {total} result(s)
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={buildHref(basePath, Math.max(1, page - 1), size, search)}
          aria-disabled={page <= 1}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
            page <= 1
              ? "pointer-events-none text-gray-300 border-gray-100"
              : "text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-800"
          }`}
        >
          Prev
        </Link>
        {pages.map((p) => (
          <Link
            key={p}
            href={buildHref(basePath, p, size, search)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
              p === page
                ? "bg-green-700 text-white border-green-700"
                : "text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-800"
            }`}
          >
            {p}
          </Link>
        ))}
        <Link
          href={buildHref(basePath, Math.min(totalPages, page + 1), size, search)}
          aria-disabled={page >= totalPages}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
            page >= totalPages
              ? "pointer-events-none text-gray-300 border-gray-100"
              : "text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-800"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
