"use client";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function HorizontalMenu({ children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      <button
        className="px-1 transition hover:opacity-70 shrink-0"
        onClick={scrollLeft}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 scrollbar-hide w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <button
        className="px-1 transition hover:opacity-70 shrink-0"
        onClick={scrollRight}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
