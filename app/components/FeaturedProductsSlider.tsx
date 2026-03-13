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
    <div className="lg:h-[420px] md:h-[320px] h-[288px] overflow-hidden relative rounded-2xl">
      <Slider {...settings}>
        {products.map(({ banner, title, link, linkTitle }, index) => (
          <div className="select-none relative" key={index}>
            <div className="w-full lg:h-[420px] md:h-[320px] h-[288px] relative">
              <Image
                fill
                priority
                src={banner}
                alt={title}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
            </div>
            <div className="absolute inset-0 p-8 md:p-12">
              <div className="md:w-1/2 w-full h-full flex flex-col items-start justify-center">
                <h1 className="lg:text-4xl md:text-3xl text-xl font-bold text-white mb-4 drop-shadow-lg">
                  {title}
                </h1>
                <button
                  onClick={() => router.push(link)}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300"
                >
                  {linkTitle}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
