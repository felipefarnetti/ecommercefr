import Link from "next/link";
import React from "react";
import truncate from "truncate";

export interface RecentOrders {
  id: string;
  products: { title: string }[];
  customerInfo: {
    name: string;
  };
}

interface Props {
  orders: RecentOrders[];
}

const RecentOrdersList = ({ orders }: Props) => {
  return (
    <div className="space-y-4 w-full lg:w-96 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
      <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Commandes récentes</h2>
        <Link href="/orders">Voir tout</Link>
      </div>

      <div className="p-4 space-y-4 mb-2">
        {orders.map(({ id, products, customerInfo }) => {
          const extraProductsLength = products.length - 1;

          return (
            <div key={id} className="border-b border-blue-gray-300">
              <div>
                {truncate(products[0].title, 40)}{" "}
                {extraProductsLength > 0
                  ? `et ${extraProductsLength} produit/s en plus.`
                  : ""}
              </div>
              <div className="text-sm text-right">par {customerInfo.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrdersList;
