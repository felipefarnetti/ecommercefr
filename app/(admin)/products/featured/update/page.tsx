// Import des composants nécessaires
import FeaturedProductForm from "@/app/components/FeaturedProductForm";
import startDb from "@lib/db";
import FeaturedProductModel from "@models/featuredProduct";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

// Interface pour les paramètres de recherche
interface Props {
  searchParams: { id: string };
}

// Obtenir un produit vedette
const fetchFeaturedProduct = async (id: string) => {
  // Vérifier si l'identifiant est valide
  if (!isValidObjectId(id)) {
    return redirect("/404");
  }

  // Connecter à la base de données
  await startDb();

  // Obtenir le produit vedette
  const product = await FeaturedProductModel.findById(id);

  // Vérifier si le produit vedette existe
  if (!product) {
    return redirect("/404");
  }

  // Renvoyer le produit vedette
  return {
    id: product._id.toString(),
    title: product.title,
    banner: product.banner.url,
    link: product.link,
    linkTitle: product.linkTitle,
  };
};

// Afficher le formulaire de mise à jour d'un produit vedette
export default async function UpdateFeaturedProduct({ searchParams }: Props) {
  // Obtenir l'identifiant du produit vedette
  const { id } = searchParams;

  // Obtenir le produit vedette
  const product = await fetchFeaturedProduct(id);

  // Renvoyer le formulaire de mise à jour d'un produit vedette
  return (
    <div>
      <FeaturedProductForm initialValue={product} />
    </div>
  );
}
