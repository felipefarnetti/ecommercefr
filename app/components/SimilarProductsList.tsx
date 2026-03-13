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
  return (
    <div className="py-6">
      <h1 className="text-xl font-bold mb-4 text-slate-900">
        Ça pourrait vous plaire
      </h1>
      <HorizontalMenu>
        {products.map((product) => {
          return (
            <Link href={`/${product.title}/${product.id}`} key={product.id}>
              <div className="w-[150px] space-y-2 mr-2 rounded-xl border border-slate-100 hover:shadow-md transition p-2">
                <Image
                  width={150}
                  height={150}
                  src={product.thumbnail}
                  alt={product.title}
                  className="rounded h-24 w-24"
                />
                <div>
                  <h2 className="text-sm line-clamp-3">{product.title}</h2>
                  <h2>{formatPrice(product.price)}</h2>
                </div>
              </div>
            </Link>
          );
        })}
      </HorizontalMenu>
    </div>
  );
}
