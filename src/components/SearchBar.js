// SearchBar.jsx
import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ placeholder = "Pesquisar...", onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-4 left-4 right-4 z-50 flex items-center bg-white rounded-full px-3 py-2 shadow-md"
    >
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-1 text-sm focus:outline-none"
      />
      {query.length > 0 && (
        <button type="button" onClick={() => setQuery("")}>
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </form>
  );
}
