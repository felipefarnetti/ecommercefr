"use client";
// Importation des dépendances nécessaires
import React, { useState } from "react";
import CartCountUpdater from "@components/CartCountUpdater";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react";
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
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-300">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="pl-4 py-2 rounded-md h-16 w-16">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  height={40}
                  width={40}
                />
              </td>
              <td className="py-4 text-xs md:text-xl lg:text-xl pl-2">
                {product.title}
              </td>
              <td className="py-4 font-semibold text-md md:text-xl lg:text-xl">
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
              <td className="py-4 text-right rounded-md">
                <button
                  onClick={() => updateCart(product.id, -product.qty)}
                  disabled={busy}
                  className="text-red-500"
                  style={{ opacity: busy ? "0.5" : "1" }}
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col justify-end items-end space-y-4">
        <div className="flex justify-end space-x-4 text-blue-gray-800 mt-4">
          <p className="font-semibold text-2xl">Total</p>
          <div>
            <p className="font-semibold text-2xl">{formatPrice(cartTotal)}</p>
            <p className="text-right text-sm">{totalQty} items</p>
          </div>
        </div>
        <Button
          className="shadow-none hover:shadow-none  focus:shadow-none focus:scale-105 active:scale-100"
          color="green"
          disabled={busy}
          onClick={handleCheckout}
        >
          Payer
        </Button>
      </div>
    </div>
  );
};

export default CartItems;
