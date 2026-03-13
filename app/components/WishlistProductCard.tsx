"use client";
import Image from "next/image";
import React, { useTransition } from "react";
import { formatPrice } from "@utils/helper";
import Wishlist from "@ui/Wishlist";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
  };
}

export default function WishlistProductCard({ product }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { id, price, thumbnail, title } = product;

  const updateWishlist = async () => {
    if (!id) return;

    const res = await fetch("/api/product/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId: id }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.error(error);

    router.refresh();
  };

  return (
    <div className="flex space-x-4 items-center bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-shadow">
      <Image src={thumbnail} width={100} height={100} alt={title} className="rounded-lg" />
      <Link className="flex-1 h-full" href={`/${title}/${id}`}>
        <h1 className="text-lg text-slate-800 font-semibold">{title}</h1>
        <p className="font-bold text-slate-900">{formatPrice(price)}</p>
      </Link>
      <button
        onClick={() => {
          startTransition(async () => await updateWishlist());
        }}
        disabled={isPending}
        className="px-4 py-2 text-red-500 hover:bg-slate-50 rounded-lg disabled:opacity-50 transition-colors"
      >
        <Wishlist isActive />
      </button>
    </div>
  );
}
