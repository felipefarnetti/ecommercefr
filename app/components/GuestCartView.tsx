"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@utils/helper";
import useGuestCart from "@hooks/useGuestCart";
import CartCountUpdater from "@components/CartCountUpdater";

export default function GuestCartView() {
  const { items, total, count, updateQuantity, removeItem } = useGuestCart();

  if (items.length === 0) {
    return (
      <div className="py-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Détails de votre panier</h1>
          <hr />
        </div>
        <h1 className="text-center font-semibold text-2xl opacity-40 py-10">
          Votre panier est vide !
        </h1>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="pl-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
            <th className="py-3 pl-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produit</th>
            <th className="py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</th>
            <th className="py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantité</th>
            <th className="py-3 text-right pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {items.map((item, index) => (
            <tr key={item.productId} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              <td className="pl-4 py-3 h-16 w-16">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  height={40}
                  width={40}
                  className="rounded-md"
                />
              </td>
              <td className="py-4 text-xs md:text-base lg:text-lg pl-2 text-slate-700">
                {item.title}
              </td>
              <td className="py-4 font-semibold text-md md:text-lg lg:text-xl text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </td>
              <td className="py-4">
                <CartCountUpdater
                  onDecrement={() => updateQuantity(item.productId, -1)}
                  onIncrement={() => updateQuantity(item.productId, 1)}
                  value={item.quantity}
                />
              </td>
              <td className="py-4 text-right pr-4">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-slate-50 rounded-xl p-6 mt-6">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-2xl text-slate-800">Total</p>
          <div className="text-right">
            <p className="font-bold text-2xl text-slate-900">{formatPrice(total)}</p>
            <p className="text-sm text-slate-500">{count} articles</p>
          </div>
        </div>
        <Link
          href="/auth/signin"
          className="block w-full mt-4 bg-amber-500 text-white py-3 rounded-lg font-semibold text-sm uppercase hover:bg-amber-600 transition-colors text-center"
        >
          Se connecter pour payer
        </Link>
      </div>
    </div>
  );
}
