// Importer les dépendances nécessaires
import startDb from "@lib/db";
import SearchFilter from "@components/SearchFilter";
import React from "react";
import { FilterQuery } from "mongoose";
import ProductModel, { ProductDocument } from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard, { Product } from "@components/ProductCard";

// Options de recherche possibles
type options = {
  query: string; // Terme de recherche
  priceSort?: "asc" | "desc"; // Trier par prix (ascendant ou descendant)
  maxRating?: number; // Note maximale
  minRating?: number; // Note minimale
};

interface Props {
  searchParams: options; // Propriétés de recherche passées au composant
}

// Fonction pour rechercher des produits
const searchProducts = async (options: options) => {
  const { query, maxRating, minRating, priceSort } = options;
  await startDb(); // Initialisation de la base de données

  // Filtre pour rechercher par titre (recherche insensible à la casse)
  const filter: FilterQuery<ProductDocument> = {
    title: { $regex: query, $options: "i" },
  };

  // Filtrage par note si des valeurs minimales et maximales sont spécifiées
  if (typeof minRating === "number" && typeof maxRating === "number") {
    const minCondition = minRating >= 0;
    const maxCondition = maxRating <= 5;
    if (minCondition && maxCondition) {
      filter.rating = { $gte: minRating, $lte: maxRating };
    }
  }

  // Requête à la base de données pour récupérer les produits filtrés
  const products = await ProductModel.find({
    ...filter,
  }).sort({ "price.discounted": priceSort === "asc" ? 1 : -1 });

  // Formatage des données des produits pour l'affichage
  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
      rating: product.rating,
    };
  });

  return JSON.stringify(productList);
};

// Composant de recherche
export default async function Search({ searchParams }: Props) {
  const { maxRating, minRating } = searchParams;
  const results = JSON.parse(
    await searchProducts({
      ...searchParams,
      maxRating: maxRating ? +maxRating : undefined,
      minRating: minRating ? +minRating : undefined,
    })
  ) as Product[];

  const noProducts = !results.length; // Vérifie s'il n'y a aucun produit trouvé

  return (
    <div>
      <SearchFilter>
        {noProducts ? (
          <h1 className="text-xl font-semibold text-blue-gray-500 text-center">
            Aucun produit trouvé
          </h1>
        ) : (
          <GridView>
            {results.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </GridView>
        )}
      </SearchFilter>
    </div>
  );
}
