"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  type: "position" | "skillLevel";
  typeOptions: string[];
}

export default function FinderFilters({ type, typeOptions }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="City"
        defaultValue={searchParams.get("city") || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateParam("city", (e.target as HTMLInputElement).value);
          }
        }}
        className="w-40 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <select
        defaultValue={searchParams.get(type) || ""}
        onChange={(e) => updateParam(type, e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">
          {type === "position" ? "All Positions" : "All Skill Levels"}
        </option>
        {typeOptions.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
