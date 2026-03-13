"use client";

import { StarIcon as RatedIcon } from "@heroicons/react/24/solid";
import { StarIcon as UnratedIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  rating: number;
}

export default function ReviewStars({ rating }: Props) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <RatedIcon className="h-4 w-4 text-yellow-400" />
          ) : (
            <UnratedIcon className="h-4 w-4 text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
}
