"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { formatPrice } from "@utils/helper";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type product = {
  id: string;
  title: string;
  thumbnail: string;
  totalPrice: number;
  price: number;
  qty: number;
};

export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    address: { [key: string]: string | null };
  };
  subTotal: number;
  products: product[];
  deliveryStatus: string;
  createdAt: Date;
}

interface Props {
  order: Order;
  disableUpdate?: boolean;
}

type address = {
  city: string;
  country: string;
  line1: string;
  line2: string | null;
  postal_code: string;
  state: string;
};

const ORDER_STATUS = ["livré", "commandé", "expédié"];

const formatAddress = ({
  line1,
  line2,
  city,
  country,
  postal_code,
}: address): React.JSX.Element => {
  return (
    <div>
      <p className="text-sm">
        <span className="font-semibold">Adresse: </span>{line1}
      </p>
      {line2 ? (
        <p className="text-sm">
          <span className="font-semibold">Adresse 2: </span>{line2}
        </p>
      ) : null}
      <p className="text-sm">
        <span className="font-semibold">Ville: </span>{city}, {postal_code} — {country}
      </p>
    </div>
  );
};

export default function OrderCard({ order, disableUpdate = true }: Props) {
  const [isPending, startTransition] = useTransition();
  const createdAtDate = new Date(order.createdAt);
  const formattedDate = format(createdAtDate, "d MMMM yyyy", { locale: fr });

  return (
    <div className="space-y-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      {/* Header: customer + total */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex space-x-3">
          <Image
            src={order.customer.avatar || "/avatar.png"}
            alt="avatar"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold truncate">{order.customer.name}</p>
            <p className="text-sm text-slate-500 truncate">{order.customer.email}</p>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
        </div>

        <div className="text-right sm:text-right">
          <p className="text-xs text-slate-500">Montant total</p>
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(order.subTotal)}
          </p>
        </div>
      </div>

      {/* Address + Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm mb-1">Adresse</p>
          {formatAddress(order.customer.address as any)}
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            disabled={disableUpdate || isPending}
            value={order.deliveryStatus}
            className="uppercase w-full sm:w-auto border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400 transition bg-slate-50 disabled:opacity-50"
            onChange={(e) => {
              const deliveryStatus = e.target.value;
              startTransition(async () => {
                await fetch("/api/order/update-status", {
                  method: "POST",
                  body: JSON.stringify({ orderId: order.id, deliveryStatus }),
                });
              });
            }}
          >
            {ORDER_STATUS.map((op) => (
              <option value={op} className="uppercase" key={op}>
                {op}
              </option>
            ))}
          </select>
          <label className="absolute -top-2 left-2 bg-slate-50 px-1 text-xs text-slate-500">
            Statut
          </label>
        </div>
      </div>

      {/* Products — cards on mobile, table on desktop */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-slate-500">Produit/s</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-slate-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr
                key={product.id}
                className={index < order.products.length - 1 ? "border-b border-slate-100" : ""}
              >
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <Image
                      src={product.thumbnail}
                      width={50}
                      height={50}
                      alt={product.title}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-sm">{product.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatPrice(product.price)} x {product.qty}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4 font-semibold text-sm">
                  {formatPrice(product.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile product list */}
      <div className="sm:hidden space-y-2">
        {order.products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 bg-slate-50 rounded-lg p-2"
          >
            <Image
              src={product.thumbnail}
              width={40}
              height={40}
              alt={product.title}
              className="rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{product.title}</p>
              <p className="text-xs text-slate-500">
                {formatPrice(product.price)} x {product.qty}
              </p>
            </div>
            <p className="text-sm font-bold text-slate-900 flex-shrink-0">
              {formatPrice(product.totalPrice)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
