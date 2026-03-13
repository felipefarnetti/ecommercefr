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
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={query || searchQuery}
          onChange={({ target }) => setQuery(target.value)}
          placeholder="Rechercher un produit..."
          className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all"
        />
      </div>
    </form>
  );
}
