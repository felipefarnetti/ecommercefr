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
  className: "w-full max-w-[420px]",
};

const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export default function ProductImageGallery(props: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images } = props;
  const slider = useRef<Slider>(null);

  return (
    <div className="max-w-[420px]">
      <div className="rounded-xl overflow-hidden bg-slate-100">
        <Slider
          {...settings}
          afterChange={(currentSlide) => {
            setCurrentSlide(currentSlide);
          }}
          ref={slider}
        >
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Product"
              width={420}
              height={420}
              placeholder="blur"
              blurDataURL={rgbDataURL(237, 181, 6)}
              className="object-cover"
            />
          ))}
        </Slider>
      </div>
      <div className="flex gap-2 mt-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => slider.current?.slickGoTo(index)}
            className={`rounded-lg overflow-hidden border-2 transition-all ${
              index === currentSlide
                ? "border-amber-500 shadow-md"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt="Thumbnail" width={72} height={72} className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
