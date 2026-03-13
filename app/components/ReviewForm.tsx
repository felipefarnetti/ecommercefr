"use client";

import { StarIcon as RatedIcon } from "@heroicons/react/24/solid";
import { StarIcon as UnratedIcon } from "@heroicons/react/24/outline";
import React, { useState, FormEventHandler, useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  productId: string;
  initialValue?: { rating: number; comment: string };
}

export default function ReviewForm({ productId, initialValue }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  const submitReview: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { comment, rating } = review;
    if (!rating) {
      return toast.error("Évaluation manquante!");
    }
    setIsPending(true);

    const res = await fetch("/api/product/review", {
      method: "POST",
      body: JSON.stringify({ comment, rating, productId }),
    });

    const { error } = await res.json();
    setIsPending(false);
    if (!res.ok) {
      return toast.error(error);
    } else {
      toast.success("Évaluation enregistré avec succès");
      // Reload the page after a successful submission
      window.location.reload();
    }
  };

  const goBack = () => {
    window.history.back(); // Go back to the previous page
  };

  useEffect(() => {
    if (initialValue) setReview({ ...initialValue });
  }, [initialValue]);

  const currentRating = initialValue?.rating || review.rating;

  return (
    <form onSubmit={submitReview} className="space-y-2">
      <div>
        <h3 className="font-semibold text-lg mb-1">Note globale</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReview({ ...review, rating: star })}
              className="focus:outline-none"
            >
              {star <= currentRating ? (
                <RatedIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <UnratedIcon className="h-8 w-8 text-yellow-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-1">Laisser une évaluation</h3>
        <textarea
          placeholder="Écrivez ce que vous aimez ou pas au sujet du produit."
          className="w-full resize-none border p-2 rounded border-blue-gray-500 outline-blue-400 transition"
          rows={4}
          value={review.comment}
          onChange={({ target }) =>
            setReview({ ...review, comment: target.value })
          }
        />
      </div>
      <div className="text-right">
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium uppercase hover:bg-blue-600 disabled:opacity-50"
        >
          Envoyer
        </button>
        <button
          type="button"
          className="ml-2 bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium uppercase hover:bg-yellow-700"
          onClick={goBack}
        >
          Retour
        </button>
      </div>
    </form>
  );
}
