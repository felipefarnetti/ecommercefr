"use client";
import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import useGuestCart from "@hooks/useGuestCart";

interface Props {
  cartItems: number;
}

export default function CartIcon({ cartItems }: Props) {
  const { loggedIn } = useAuth();
  const guestCart = useGuestCart();

  const totalItems = loggedIn ? cartItems : cartItems + guestCart.count;

  return (
    <Link
      className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
      href="/cart"
    >
      <ShoppingCartIcon className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full min-w-[18px] min-h-[18px]">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
