import React from "react";
import BuyingOptions from "@components/BuyingOptions";
import { formatPrice } from "@utils/helper";
import ProductImageGallery from "@components/ProductImageGallery";
import Rating from "./Rating";

interface Props {
  title: string;
  description: string;
  images: string[];
  points?: string[];
  price: { base: number; discounted: number };
  sale: number;
  rating: number;
  outOfStock: boolean;
  isWishlist?: boolean;
}

export default function ProductView({
  description,
  images,
  title,
  points,
  price,
  sale,
  rating,
  outOfStock,
  isWishlist,
}: Props) {
  return (
    <div className="flex lg:flex-row flex-col gap-8 lg:gap-12">
      <div className="flex-1 lg:self-start self-center">
        <ProductImageGallery images={images} />
      </div>

      <div className="flex-1 space-y-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {title}
          </h1>
          {rating ? <Rating value={parseFloat(rating.toFixed(1))} /> : null}
        </div>

        <p className="text-slate-600 leading-relaxed">{description}</p>

        {points && points.length > 0 && (
          <ul className="space-y-1.5 text-slate-600">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3 py-2">
          <span
            className={
              price.base !== price.discounted
                ? "line-through text-slate-400 text-lg"
                : "text-2xl font-bold text-slate-900"
            }
          >
            {formatPrice(price.base)}
          </span>
          {price.base !== price.discounted && (
            <>
              <span className="text-2xl font-bold text-slate-900">
                {formatPrice(price.discounted)}
              </span>
              <span className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                -{sale}%
              </span>
            </>
          )}
        </div>

        <div className="pt-2">
          {outOfStock ? (
            <div className="inline-block bg-slate-100 text-slate-500 font-semibold uppercase text-sm px-6 py-3 rounded-lg">
              Hors stock
            </div>
          ) : (
            <BuyingOptions wishlist={isWishlist} />
          )}
        </div>
      </div>
    </div>
  );
}
