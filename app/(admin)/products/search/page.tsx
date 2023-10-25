// Importer les dépendances nécessaires
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import ProductTable from "@components/ProductTable";
import React from "react";

// Interface pour les paramètres de recherche
interface Props {
  searchParams: { query: string };
}

// Rechercher des produits
const searchProducts = async (query: string) => {
  // Connecter à la base de données
  await startDb();

  // Rechercher les produits dont le titre correspond à la requête de recherche
  const products = await ProductModel.find({
    title: { $regex: query, $options: "i" },
  });

  // Convertir les produits en un tableau de résultats
  const results = products.map(
    ({
      _id,
      description,
      thumbnail,
      category,
      quantity,
      title,
      price,
      sale,
    }) => {
      return {
        id: _id.toString(),
        title,
        thumbnail: thumbnail.url,
        description,
        price: {
          mrp: price.base,
          salePrice: price.discounted,
          saleOff: sale,
        },
        category,
        quantity,
      };
    }
  );

  // Renvoyer les résultats
  return JSON.stringify(results);
};

// Afficher les résultats de la recherche de produits
export default async function AdminSearch({ searchParams }: Props) {
  // Obtenir la requête de recherche
  const { query } = searchParams;

  // Rechercher les produits
  const results = JSON.parse(await searchProducts(query));

  // Renvoyer le tableau des résultats de la recherche
  return (
    <div>
      <ProductTable
        products={results}
        showPageNavigator={false}
        currentPageNo={0}
      />
    </div>
  );
}
