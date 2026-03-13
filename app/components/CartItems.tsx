"use client";
// Importation des dépendances nécessaires
import React, { useState } from "react";
import CartCountUpdater from "@components/CartCountUpdater";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "@utils/helper";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export interface Product {
  id: string;
  thumbnail: string;
  title: string;
  price: number;
  totalPrice: number;
  qty: number;
}

interface CartItemsProps {
  products: Product[];
  cartTotal: number;
  totalQty: number;
  cartId: string;
}

const CartItems: React.FC<CartItemsProps> = ({
  products = [],
  totalQty,
  cartTotal,
  cartId,
}) => {
  const [busy, setBusy] = useState(false); // État pour indiquer si l'interface est occupée
  const router = useRouter(); // Utilisation de l'utilitaire de navigation de Next.js

  const handleCheckout = async () => {
    setBusy(true); // Marque l'interface comme occupée
    const res = await fetch("/api/checkout", {
      // Appel à l'API de paiement
      method: "POST",
      body: JSON.stringify({ cartId }),
    });

    const { error, url } = await res.json();

    if (!res.ok) {
      toast.error(error); // Affiche une notification d'erreur
    } else {
      // Ouvre l'URL de paiement
      window.location.href = url;
    }
    setBusy(false); // Marque l'interface comme disponible
  };

  const updateCart = async (productId: string, quantity: number) => {
    setBusy(true); // Marque l'interface comme occupée
    await fetch("/api/product/cart", {
      // Appel à l'API pour mettre à jour le panier
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });
    router.refresh(); // Actualise la page
    setBusy(false); // Marque l'interface comme disponible
  };

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">Votre panier est vide.</p>
        </div>
      ) : (
        <>
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
              {products.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="pl-4 py-3 h-16 w-16">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      height={40}
                      width={40}
                      className="rounded-md"
                    />
                  </td>
                  <td className="py-4 text-xs md:text-base lg:text-lg pl-2 text-slate-700">
                    {product.title}
                  </td>
                  <td className="py-4 font-semibold text-md md:text-lg lg:text-xl text-slate-900">
                    {formatPrice(product.totalPrice)}
                  </td>
                  <td className="py-4">
                    <CartCountUpdater
                      onDecrement={() => updateCart(product.id, -1)}
                      onIncrement={() => updateCart(product.id, 1)}
                      value={product.qty}
                      disabled={busy}
                    />
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      onClick={() => updateCart(product.id, -product.qty)}
                      disabled={busy}
                      className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
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
                <p className="font-bold text-2xl text-slate-900">{formatPrice(cartTotal)}</p>
                <p className="text-sm text-slate-500">{totalQty} items</p>
              </div>
            </div>
            <button
              className="w-full mt-4 bg-amber-500 text-white py-3 rounded-lg font-semibold text-sm uppercase hover:bg-amber-600 transition-colors focus:scale-105 active:scale-100 disabled:opacity-50"
              disabled={busy}
              onClick={handleCheckout}
            >
              Payer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
