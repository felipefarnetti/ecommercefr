"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import Slider, { Settings } from "react-slick";

export interface FeaturedProduct {
  id: string;
  banner: string;
  title: string;
  link: string;
  linkTitle: string;
}

interface Props {
  products: FeaturedProduct[];
}

const settings: Settings = {
  dots: true,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 4000,
};

export default function FeaturedProductsSlider({ products }: Props) {
  const router = useRouter();

  if (!products.length) return null;

  return (
    <div className="lg:h-[420px] md:h-[320px] h-[240px] overflow-hidden relative rounded-2xl">
      <Slider {...settings}>
        {products.map(({ banner, title, link, linkTitle }, index) => (
          <div className="select-none relative" key={index}>
            <div className="w-full lg:h-[420px] md:h-[320px] h-[240px] relative">
              <Image
                fill
                priority
                src={banner}
                alt={title}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center p-6 md:p-8">
              <button
                onClick={() => router.push(link)}
                className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-lg"
              >
                {title}
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
