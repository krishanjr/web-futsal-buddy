interface PaginationMeta {
  page?: number;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
}

interface PaginationProps {
  basePath?: string;
  pagination?: PaginationMeta;
  search?: string;
}

export default function Pagination({ basePath, pagination }: PaginationProps) {
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      {basePath ? <span className="text-xs text-gray-400">{basePath}</span> : null}
    </div>
  );
}
