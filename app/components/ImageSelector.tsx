"use client";
import React, { ChangeEventHandler } from "react";
import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ImageInput from "@ui/ImageInput";

interface Props {
  id: string;
  images?: string[];
  multiple?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onRemove?(index: number): void;
}

export default function ImageSelector({
  id,
  images,
  onChange,
  onRemove,
  multiple,
}: Props) {
  const icon = multiple ? (
    <div className="relative">
      <PhotoIcon className="w-8 h-8 bg-white" />
      <PhotoIcon className="w-8 h-8 absolute -top-2 -right-2 -z-10" />
    </div>
  ) : (
    <PhotoIcon className="w-8 h-8" />
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {images?.map((img, index) => {
        return (
          <div key={index} className="relative group/img w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src={img}
              alt="product"
              fill
              sizes="80px"
              className="object-cover"
            />
            {multiple ? (
              <div
                onClick={() => onRemove && onRemove(index)}
                className="absolute inset-0 bg-black/0 group-hover/img:bg-black/50 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
              >
                <TrashIcon className="w-5 h-5" />
              </div>
            ) : null}
          </div>
        );
      })}

      <ImageInput id={id} onChange={onChange} multiple={multiple}>
        {icon}
      </ImageInput>
    </div>
  );
}
