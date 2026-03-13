"use client";
import Image from "next/image";
import Link from "next/link";
import truncate from "truncate";
import { formatPrice } from "@utils/helper";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout/instant", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
    });
    const { error, url } = await res.json();
    if (!res.ok) {
      toast.error(error);
    } else {
      // open the checkout url
      window.location.href = url;
    }
  };

  const addToCart = async () => {
    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.error(error);
    router.refresh();
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-md overflow-hidden">
      <Link className="w-full" href={`/${product.title}/${product.id}`}>
        <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
          {product.price.base !== product.price.discounted && (
            <div className="absolute right-0 p-2">
              <span className="inline-block bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                {`- ${product.sale}%`}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            <h3 className="line-clamp-1 font-medium text-blue-gray-800">
              {truncate(product.title, 50)}
            </h3>
            <div className="flex justify-end">
              {product.rating ? (
                <Rating value={parseFloat(product.rating.toFixed(1))} />
              ) : null}
            </div>
          </div>
          <div className="flex justify-end items-center space-x-2 mb-2">
            {product.price.base === product.price.discounted ? (
              <span className="font-medium text-blue-gray-800">
                {formatPrice(product.price.discounted)}
              </span>
            ) : (
              <>
                <span className="text-sm text-blue-gray-800 line-through">
                  {formatPrice(product.price.base)}
                </span>
                <span className="font-medium text-blue-gray-800">
                  {formatPrice(product.price.discounted)}
                </span>
              </>
            )}
          </div>
          <p className="font-normal text-sm opacity-75 line-clamp-3">
            {truncate(product.description, 45)}
          </p>
        </div>
      </Link>

      {/* Pour supprimer les bouttons achat et ajouter au panier */}

      <div className="px-4 pb-4 pt-0 space-y-4">
        <button
          onClick={() => {
            startTransition(async () => await addToCart());
          }}
          disabled={isPending}
          className="w-full bg-blue-gray-900/10 text-blue-gray-900 py-2 px-4 rounded-lg text-sm font-medium uppercase hover:scale-105 focus:scale-105 active:scale-100 transition-transform disabled:opacity-50"
        >
          Ajouter au panier
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => await handleCheckout());
          }}
          className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg text-sm font-medium uppercase hover:scale-105 focus:scale-105 active:scale-100 transition-transform disabled:opacity-50"
        >
          Acheter maintenant
        </button>
      </div>
    </div>
  );
}
