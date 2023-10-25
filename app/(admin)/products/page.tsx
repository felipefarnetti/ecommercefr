// Importer les dépendances nécessaires
import ProductTable, { Product } from "@components/ProductTable";
import startDb from "@lib/db";
import ProductModel from "@app/models/productModel";
import { redirect } from "next/navigation";
import React from "react";

// Obtenir les produits
const fetchProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  // Vérifier si le numéro de page est valide
  if (isNaN(pageNo)) {
    // Rediriger vers la page 404 si le numéro de page n'est pas valide
    return redirect("/404");
  }

  // Connecter à la base de données
  await startDb();

  // Obtenir les produits à partir de la base de données
  const products = await ProductModel.find()
    // Trier les produits par ordre chronologique décroissant
    .sort("-createdAt")
    // Ignorer les premiers produits (en fonction du numéro de page et du nombre de produits par page)
    .skip((pageNo - 1) * perPage)
    // Limiter le nombre de produits retournés (en fonction du nombre de produits par page)
    .limit(perPage);

  // Convertir les produits en un tableau d'objets
  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};

// Nombre de produits par page
const PRODUCTS_PER_PAGE = 10;

// Interface pour les paramètres de la page
interface Props {
  searchParams: { page: string };
}

// Afficher la liste des produits
export default async function Products({ searchParams }: Props) {
  // Obtenir le numéro de page
  const { page = "1" } = searchParams;

  // Vérifier si le numéro de page est valide
  if (isNaN(+page)) {
    // Rediriger vers la page 404 si le numéro de page n'est pas valide
    return redirect("/404");
  }

  // Obtenir les produits
  const products = await fetchProducts(+page, PRODUCTS_PER_PAGE);

  // Vérifier s'il y a plus de produits à charger
  let hasMore = true;

  if (products.length < PRODUCTS_PER_PAGE) {
    hasMore = false;
  }

  // Renvoyer la liste des produits
  return (
    <div>
      <ProductTable
        products={products}
        currentPageNo={+page}
        hasMore={hasMore}
      />
    </div>
  );
}
