interface Props {
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({ placeholder, defaultValue }: Props) {
  return (
    <form method="GET" className="flex items-center gap-2">
      <input
        type="text"
        name="search"
        defaultValue={defaultValue}
        placeholder={placeholder || "Search…"}
        className="w-64 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
      />
      <input type="hidden" name="page" value="1" />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}
