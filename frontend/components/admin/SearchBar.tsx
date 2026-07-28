interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBar({ placeholder = "Search", defaultValue = "" }: SearchBarProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
      <input
        className="w-full outline-none"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </div>
  );
}
