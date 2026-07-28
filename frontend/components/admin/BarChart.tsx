export default function BarChart({
  data,
  labelKey,
  valueKey,
  valuePrefix,
}: {
  data: Record<string, any>[];
  labelKey: string;
  valueKey: string;
  valuePrefix?: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-400">No data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d[labelKey]} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-16 shrink-0">{d[labelKey]}</span>
          <div className="flex-1 h-5 bg-gray-50 rounded-md overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-md transition-all"
              style={{ width: `${(d[valueKey] / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-16 text-right shrink-0">
            {valuePrefix}
            {d[valueKey]}
          </span>
        </div>
      ))}
    </div>
  );
}
