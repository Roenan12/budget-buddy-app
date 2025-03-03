"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/forms";

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="mb-4">
      <div className="relative w-full lg:w-[572px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search expenses..."
          onChange={(e) => onSearch(e.target.value)}
          className="flex w-full p-2 pl-10 border rounded-md"
        />
      </div>
    </div>
  );
}

export default SearchBar;
