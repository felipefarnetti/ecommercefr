import React from "react";
import Image from "next/image";
import ReviewStars from "@components/ReviewStars";

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  userInfo: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface Props {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: Props) {
  return (
    <div className="space-y-3">
      {reviews?.map((review) => (
        <div
          className="bg-white border border-slate-100 rounded-xl p-4 space-y-2.5"
          key={review.id}
        >
          <div className="flex items-center gap-3">
            <Image
              width={36}
              height={36}
              className="rounded-full object-cover"
              src={review.userInfo.avatar || "/avatar.png"}
              alt={review.userInfo.name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-slate-800">
                  {review.userInfo.name}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(review.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <ReviewStars rating={review.rating} />
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-slate-600 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
