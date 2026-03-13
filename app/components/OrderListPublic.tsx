"use client";
import Image from "next/image";
import React from "react";
import dateFormat from "dateformat";
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

export interface Orders {
  id: any;
  products: product[];
  paymentStatus: string;
  date: string;
  total: number;
  deliveryStatus: "commandé" | "livré" | "expédié";
}

export default function OrderListPublic({ orders }: { orders: Orders[] }) {
  // Check if there are no orders
  if (orders.length === 0) {
    return <h1 className="text-lg p-4">Aucune commande effectué.</h1>;
  }
  return (
    <div>
      {orders.map((order) => {
        // Analyse la chaîne de date createdAt en un objet Date
        const createdAtDate = new Date(order.date);
        // Formate la date analysée dans le format souhaité (format français)
        const formattedDate = format(createdAtDate, "d MMMM yyyy", {
          locale: fr,
        });
        return (
          <div key={order.id} className="py-4 space-y-4">
            <div className="flex justify-between items-center bg-slate-700 text-white p-2 rounded-lg">
              <p>Commandé le: {formattedDate}</p>
              <p>TOTAL {formatPrice(order.total)}</p>
              <span className="inline-block bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                {order.paymentStatus === "paid" ? "payé" : "non payé"}
              </span>
            </div>

            {order.products.map((p) => {
              return (
                <div key={p.id} className="flex space-x-2">
                  <Image
                    src={p.thumbnail}
                    width={50}
                    height={50}
                    alt={p.title}
                  />
                  <div>
                    <p>{p.title}</p>
                    <div className="flex space-x-2 text-sm">
                      <p>Qté. {p.qty}</p>
                      <p>X</p>
                      <p>Prix: {formatPrice(p.price)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-right p-2 border-t border-b border-slate-100">
              <p>
                Status de la commande:{" "}
                <span className="font-semibold uppercase">
                  {order.deliveryStatus}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
