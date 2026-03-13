"use client";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useRef, useEffect, ReactNode } from "react";

interface Props {
  children: ReactNode;
  autoScroll?: boolean;
  hideArrowsMobile?: boolean;
}

export default function HorizontalMenu({ children, autoScroll, hideArrowsMobile }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;

    const el = scrollRef.current;

    const isMobile = () => window.innerWidth < 768;

    const startAutoScroll = () => {
      if (!isMobile()) return;
      intervalRef.current = setInterval(() => {
        if (!el) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 1) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: 1, behavior: "auto" });
        }
      }, 30);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleResize = () => {
      if (!isMobile()) stopAutoScroll();
      else if (!intervalRef.current) startAutoScroll();
    };

    startAutoScroll();
    el.addEventListener("pointerenter", stopAutoScroll);
    el.addEventListener("pointerleave", startAutoScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      stopAutoScroll();
      el.removeEventListener("pointerenter", stopAutoScroll);
      el.removeEventListener("pointerleave", startAutoScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [autoScroll]);

  const arrowClass = hideArrowsMobile
    ? "hidden md:flex p-1.5 bg-white shadow-md rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition shrink-0 items-center justify-center"
    : "p-1.5 bg-white shadow-md rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition shrink-0";

  return (
    <div className="relative flex items-center">
      <button className={arrowClass} onClick={scrollLeft}>
        <ChevronLeftIcon className="w-4 h-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 scrollbar-hide w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
      <button className={arrowClass} onClick={scrollRight}>
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
