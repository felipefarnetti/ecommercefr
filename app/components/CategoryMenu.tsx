"use client";
import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import categories from "@utils/categories";
import Link from "next/link";

export default function CategoryMenu() {
  return (
    <HorizontalMenu>
      {categories.map((c) => (
        <Link key={c} href={`/browse-products/${c}`}>
          <span className="inline-block whitespace-nowrap mr-2 border border-slate-300 text-slate-600 rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
            {c}
          </span>
        </Link>
      ))}
    </HorizontalMenu>
  );
}
