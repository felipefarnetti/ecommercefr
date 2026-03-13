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
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100">
      <Link href={`/${product.title}/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.price.base !== product.price.discounted && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{product.sale}%
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 line-clamp-1 mb-1">
            {truncate(product.title, 50)}
          </h3>
          <p className="text-slate-500 text-xs line-clamp-2 mb-3">
            {truncate(product.description, 60)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {product.price.base !== product.price.discounted ? (
                <>
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(product.price.discounted)}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(product.price.base)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-slate-900">
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

      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => startTransition(async () => await addToCart())}
          disabled={isPending}
          className="flex-1 text-xs font-semibold uppercase py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Ajouter au panier
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(async () => await handleCheckout())}
          className="flex-1 text-xs font-semibold uppercase py-2.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          Acheter
        </button>
      </div>
    </div>
  );
}
