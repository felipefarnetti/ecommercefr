// Importation des dépendances nécessaires
import WishlistProductCard from "@components/WishlistProductCard";
import WishlistModel from "@models/wishlistModel";
import { auth } from "@/auth";
import { ObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

// Fonction pour récupérer les produits de la liste de souhaits de l'utilisateur
const fetchProducts = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/404");

  // Récupération de la liste de souhaits de l'utilisateur
  const wishlist = await WishlistModel.findOne<{
    products: [
      {
        _id: ObjectId;
        title: string;
        thumbnail: { url: string };
        price: { discounted: number };
      }
    ];
  }>({
    user: session.user.id,
  }).populate({
    path: "products",
    select: "title thumbnail.url price.discounted",
  });

  // Si la liste de souhaits est vide, retourner un tableau vide
  if (!wishlist) return [];

  // Transformation des produits en un format adapté pour l'affichage
  return wishlist?.products.map(({ _id, title, price, thumbnail }) => {
    return {
      id: _id.toString(),
      title,
      price: price.discounted,
      thumbnail: thumbnail.url,
    };
  });
};

export default async function Wishlist() {
  const products = await fetchProducts();

  // Si la liste de souhaits est vide, afficher un message approprié
  if (!products.length)
    return (
      <h1 className="text-2xl opacity-50 text-center p-6 font-semibold">
        {"Il n'y a aucun produit dans votre liste de souhaits."}
      </h1>
    );

  // Affichage de la liste de souhaits
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">Votre Liste de Souhaits</h1>
      {products.map((product) => {
        return <WishlistProductCard product={product} key={product.id} />;
      })}
    </div>
  );
}
