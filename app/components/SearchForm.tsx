import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  submitTo: string;
}

export default function SearchForm({ submitTo }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const searchQuery = params.get("query") || "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!query) return;
        router.push(`${submitTo}${query}`);
      }}
      className="w-full"
    >
      <div className="relative w-full">
        <input
          value={query || searchQuery}
          onChange={({ target }) => setQuery(target.value)}
          placeholder=" "
          className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 pr-10 text-sm outline-none focus:border-blue-500 transition"
        />
        <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
          Recherche
        </label>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </form>
  );
}
