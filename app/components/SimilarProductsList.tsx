import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import Image from "next/image";
import { formatPrice } from "../utils/helper";
import Link from "next/link";

interface Props {
  products: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  }[];
}

export default function SimilarProductsList({ products }: Props) {
  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Ça pourrait vous plaire
      </h2>
      <HorizontalMenu>
        {products.map((product) => (
          <Link href={`/${product.title}/${product.id}`} key={product.id}>
            <div className="w-[112px] md:w-[128px] mr-2 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  sizes="128px"
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="text-[11px] font-medium text-slate-700 line-clamp-2 leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalMenu>
    </section>
  );
}
