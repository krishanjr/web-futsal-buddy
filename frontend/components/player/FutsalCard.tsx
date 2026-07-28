import Link from "next/link";
import { Futsal } from "@/lib/types";

export default function FutsalCard({ futsal }: { futsal: Futsal }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-32 bg-green-50 flex items-center justify-center text-3xl">
        {futsal.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={futsal.images[0]}
            alt={futsal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          "🏟️"
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">{futsal.name}</p>
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
            Rs. {futsal.pricePerHour}/hr
          </span>
        </div>
        {futsal.reviewCount > 0 && (
          <span className="text-xs font-medium text-amber-700 -mt-1">
            ★ {futsal.rating.toFixed(1)} ({futsal.reviewCount})
          </span>
        )}
        <p className="text-xs text-gray-500">
          {futsal.district}
          {futsal.municipality ? `, ${futsal.municipality}` : ""}
        </p>
        <p className="text-xs text-gray-400">
          {futsal.openingTime} – {futsal.closingTime}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {futsal.facilities.slice(0, 3).map((f) => (
            <span key={f} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
          {futsal.facilities.length > 3 && (
            <span className="text-xs text-gray-400">+{futsal.facilities.length - 3} more</span>
          )}
        </div>
        <Link
          href={`/futsals/${futsal._id}`}
          className="mt-auto pt-2 text-xs font-medium text-center bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
