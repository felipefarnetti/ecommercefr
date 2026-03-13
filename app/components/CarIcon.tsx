import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  cartItems: number;
}

export default function CartIcon({ cartItems }: Props) {
  return (
    <Link
      className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      href="/cart"
    >
      <ShoppingCartIcon className="w-5 h-5" />
      {cartItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px]">
          {cartItems}
        </span>
      )}
    </Link>
  );
}
