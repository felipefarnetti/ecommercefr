// Importer les dépendances nécessaires
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProduct";
import FeaturedProductForm from "@components/FeaturedProductForm";
import FeaturedProductTable from "@components/FeaturedProductTable";
import React from "react";

// Obtenir les produits vedettes
const fetchFeaturedProducts = async () => {
  // Connecter à la base de données
  await startDb();

  // Obtenir tous les produits vedettes
  const products = await FeaturedProductModel.find();

  // Convertir les produits vedettes en un tableau d'objets
  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      link: product.link,
      linkTitle: product.linkTitle,
      banner: product.banner.url,
    };
  });
};

// Afficher la page d'ajout de produit vedette
export default async function AddFeaturedProduct() {
  // Obtenir les produits vedettes
  const featuredProducts = await fetchFeaturedProducts();

  // Renvoyer la page d'ajout de produit vedette
  return (
    <div>
      <FeaturedProductForm />
      <FeaturedProductTable products={featuredProducts} />
    </div>
  );
}
