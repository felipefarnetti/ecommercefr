// Importer les dépendances nécessaires
import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import CategoryMenu from "@components/CategoryMenu";

// Interface définissant la structure d'un produit récent
interface LatestProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  sale: number;
}

// Fonction asynchrone pour récupérer les produits d'une catégorie donnée
const fetchProductsByCategory = async (category: string) => {
  await startDb();
  const products = await ProductModel.find({ category })
    .sort("-createdAt")
    .limit(20);

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
    };
  });

  return JSON.stringify(productList);
};

// Interface définissant les propriétés attendues
interface Props {
  params: {
    category: string;
  };
}

// Page d'affichage des produits par catégorie
export default async function ProductByCategory({ params }: Props) {
  const products = await fetchProductsByCategory(
    decodeURIComponent(params.category)
  );
  const parsedProducts = JSON.parse(products) as LatestProduct[];

  return (
    <div className="py-4 space-y-4">
      <CategoryMenu />
      {parsedProducts.length ? (
        <GridView>
          {parsedProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </GridView>
      ) : (
        <h1 className="text-center pt-8 pb-10 font-semibold text-2xl opacity-40">
          {"Désolé, il n'y a pas de produits dans cette catégorie !"}
        </h1>
      )}
    </div>
  );
}
