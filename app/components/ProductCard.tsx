"use client";
import Image from "next/image";
import Link from "next/link";
import truncate from "truncate";
import { formatPrice } from "@utils/helper";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import useGuestCart from "@hooks/useGuestCart";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Rating from "./Rating";

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  rating?: number;
  sale: number;
  price: {
    base: number;
    discounted: number;
  };
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { loggedIn } = useAuth();
  const guestCart = useGuestCart();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheckout = async () => {
    if (!loggedIn) return router.push("/auth/signin");
    const res = await fetch("/api/checkout/instant", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
    });
    const { error, url } = await res.json();
    if (!res.ok) {
      toast.error(error);
    } else {
      window.location.href = url;
    }
  };

  const addToCart = async () => {
    if (!loggedIn) {
      guestCart.addItem({
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price.discounted,
      });
      return;
    }

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.error(error);
    router.refresh();
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
      <Link href={`/${product.title}/${product.id}`} className="flex-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.price.base !== product.price.discounted && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
              -{product.sale}%
            </span>
          )}
        </div>
        <div className="p-2.5 md:p-3">
          <h3 className="font-semibold text-slate-800 text-xs md:text-sm line-clamp-1">
            {truncate(product.title, 50)}
          </h3>
          <p className="text-slate-500 text-[10px] md:text-xs line-clamp-1 mt-0.5 mb-1.5">
            {truncate(product.description, 50)}
          </p>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              {product.price.base !== product.price.discounted ? (
                <>
                  <span className="text-sm md:text-base font-bold text-slate-900">
                    {formatPrice(product.price.discounted)}
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-400 line-through">
                    {formatPrice(product.price.base)}
                  </span>
                </>
              ) : (
                <span className="text-sm md:text-base font-bold text-slate-900">
                  {formatPrice(product.price.base)}
                </span>
              )}
            </div>
            {product.rating ? (
              <Rating value={parseFloat(product.rating.toFixed(1))} />
            ) : null}
          </div>
        </div>
      </Link>

      <div className="px-2.5 pb-2.5 md:px-3 md:pb-3 flex gap-1.5">
        <button
          onClick={() => startTransition(async () => await addToCart())}
          disabled={isPending}
          className="flex-1 text-[10px] md:text-xs font-semibold uppercase py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Ajouter au panier
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(async () => await handleCheckout())}
          className="flex-1 text-[10px] md:text-xs font-semibold uppercase py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Acheter
        </button>
      </div>
    </div>
  );
}
