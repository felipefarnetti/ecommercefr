"use client";

import Image from "next/image";
import React, { useTransition } from "react";
import { formatPrice } from "@utils/helper";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import the French locale

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
      <p className="font-semibold">
        Adresse: <span className="font-normal">{line1}</span>
      </p>
      {line2 ? (
        <p className="font-semibold">
          Adresse1: <span className="font-normal">{line2}</span>
        </p>
      ) : null}
      <div className="flex items-center space-x-2">
        <p className="font-semibold">
          Ville: <span className="font-normal">{city}</span>
        </p>
        <p className="font-semibold">
          Code Postale: <span className="font-normal">{postal_code}</span>
        </p>
        <p className="font-semibold">{country}</p>
      </div>
    </div>
  );
};

export default function OrderCard({ order, disableUpdate = true }: Props) {
  const [isPending, startTransition] = useTransition();
  // Analyse la chaîne de date createdAt en un objet Date
  const createdAtDate = new Date(order.createdAt);
  // Formate la date analysée dans le format souhaité (format français)
  const formattedDate = format(createdAtDate, "d MMMM yyyy", { locale: fr });

  return (
    <div className="space-y-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Image
            src={order.customer.avatar || "/avatar.png"}
            alt="avatar"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-sm">{order.customer.email}</p>
            <p className="font-semibold">Date: {formattedDate}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold">Montant total:</p>
          <p className="text-sm font-semibold">
            EUR {formatPrice(order.subTotal)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Adresse</p>
          <div className="text-sm">
            {formatAddress(order.customer.address as any)}
          </div>
        </div>
        <div>
          <div className="relative w-full">
            <select
              disabled={disableUpdate || isPending}
              value={order.deliveryStatus}
              className="uppercase w-full border border-slate-200 rounded-lg px-3 py-3 text-sm outline-none focus:border-slate-400 transition bg-slate-50 disabled:opacity-50"
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
              Status de la commande
            </label>
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-100">
          <tr>
            <th className="py-2 px-4 text-left">Produit/s</th>
            <th className="py-2 px-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr
              key={product.id}
              style={
                index < order.products.length - 1
                  ? { borderBottom: "1px solid gray" }
                  : undefined
              }
            >
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <Image
                    src={product.thumbnail}
                    width={50}
                    height={50}
                    alt={product.title}
                  />
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm">
                      Prix: {formatPrice(product.price)}
                    </p>
                    <p className="text-sm">Qté: {product.qty}</p>
                  </div>
                </div>
              </td>

              <td className="py-2 px-4">
                EUR {formatPrice(product.totalPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
