"use client";
import React from "react";
import Link from "next/link";
import {
  HomeModernIcon,
  PaintBrushIcon,
  SparklesIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
  SunIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";

const categoryData = [
  { name: "Home Improvement", label: "Maison", icon: HomeModernIcon, color: "bg-blue-50 text-blue-600" },
  { name: "Art and Crafts", label: "Art & Craft", icon: PaintBrushIcon, color: "bg-pink-50 text-pink-600" },
  { name: "Jewelry and Watches", label: "Bijoux", icon: SparklesIcon, color: "bg-amber-50 text-amber-600" },
  { name: "Gifts and Occasions", label: "Cadeaux", icon: GiftIcon, color: "bg-purple-50 text-purple-600" },
  { name: "Electronics Accessories", label: "Électronique", icon: DevicePhoneMobileIcon, color: "bg-emerald-50 text-emerald-600" },
  { name: "Garden Accessories", label: "Jardin", icon: SunIcon, color: "bg-green-50 text-green-600" },
  { name: "Handmade Clothes", label: "Vêtements", icon: ScissorsIcon, color: "bg-rose-50 text-rose-600" },
];

export default function CategoryMenu() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-3 px-4">
      {categoryData.map(({ name, label, icon: Icon, color }) => (
        <Link
          key={name}
          href={`/browse-products/${name}`}
          className="group flex flex-col items-center gap-1.5 p-2 md:p-3 rounded-xl hover:shadow-md transition-all"
        >
          <div className={`${color} p-2.5 md:p-3 rounded-xl group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="text-[10px] md:text-xs font-medium text-slate-600 text-center leading-tight">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
