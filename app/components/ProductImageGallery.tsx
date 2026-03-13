"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";

interface Props {
  images: string[];
}

const settings: Settings = {
  dots: false,
  lazyLoad: "anticipated",
  infinite: true,
  speed: 100,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
};

export default function ProductImageGallery(props: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images } = props;
  const slider = useRef<Slider>(null);

  return (
    <div className="w-[80%] mx-auto md:w-full max-w-[480px]">
      <div className="rounded-xl overflow-hidden bg-slate-100">
        <Slider
          {...settings}
          afterChange={(currentSlide) => {
            setCurrentSlide(currentSlide);
          }}
          ref={slider}
        >
          {images.map((img, index) => (
            <div key={index}>
              <div className="relative aspect-square">
                <Image
                  src={img}
                  alt="Product"
                  fill
                  sizes="480px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="flex gap-2 mt-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => slider.current?.slickGoTo(index)}
            className={`rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
              index === currentSlide
                ? "border-amber-500 shadow-md"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <div className="relative w-16 h-16">
              <Image
                src={img}
                alt="Thumbnail"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
