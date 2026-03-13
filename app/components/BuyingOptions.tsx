"use client";
// Importation des dépendances nécessaires
import React, { useState, useTransition } from "react";
import CartCountUpdater from "@components/CartCountUpdater";
import { useParams, useRouter } from "next/navigation";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import Wishlist from "@ui/Wishlist";

// Interface pour les propriétés (props) du composant
interface Props {
  wishlist?: boolean;
}

// Composant pour les options d'achat
export default function BuyingOptions({ wishlist }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const product = params.product as string[] | undefined;
  const productId = product?.[1];
  const { loggedIn } = useAuth();
  const router = useRouter();

  // Fonction pour incrémenter la quantité
  const handleIncrement = () => {
    setQuantity((prevCount) => prevCount + 1);
  };

  // Fonction pour décrémenter la quantité
  const handleDecrement = () => {
    if (quantity === 0) return;
    setQuantity((prevCount) => prevCount - 1);
  };

  // Fonction pour ajouter au panier
  const addToCart = async () => {
    if (!productId) return;

    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.error(error);

    router.refresh();
  };

  // Fonction pour passer à la caisse
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout/instant", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    const { error, url } = await res.json();
    if (!res.ok) {
      toast.error(error);
    } else {
      // Ouvrir l'URL de la caisse
      window.location.href = url;
    }
  };

  // Fonction pour mettre à jour la liste de souhaits
  const updateWishlist = async () => {
    if (!productId) return;

    if (!loggedIn) return router.push("/auth/signin");

    const res = await fetch("/api/product/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

    const { error } = await res.json();
    if (!res.ok && error) toast.error(error);

    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <CartCountUpdater
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
        value={quantity}
      />

      <button
        onClick={() => {
          startTransition(async () => await addToCart());
        }}
        disabled={isPending}
        className="border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold rounded-lg px-5 py-2.5 text-sm uppercase disabled:opacity-50 transition-colors"
      >
        Ajouter au panier
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => await handleCheckout());
        }}
        className="bg-amber-500 text-white hover:bg-amber-600 font-semibold rounded-lg px-5 py-2.5 text-sm uppercase disabled:opacity-50 transition-colors"
      >
        Acheter maintenant
      </button>

      <button
        onClick={() => {
          startTransition(async () => await updateWishlist());
        }}
        disabled={isPending}
        className="p-2.5 hover:bg-slate-50 rounded-lg disabled:opacity-50 transition-colors"
      >
        <Wishlist isActive={wishlist} />
      </button>
    </div>
  );
}
