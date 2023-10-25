// Importer les dépendances nécessaires
import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import FeaturedProductsSlider from "@components/FeaturedProductsSlider";
import FeaturedProductModel from "@models/featuredProduct";
import CategoryMenu from "@components/CategoryMenu";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

// Interface pour décrire la structure des produits les plus récents
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

// Fonction pour récupérer les derniers produits à partir de la base de données
const fetchLatestProducts = async () => {
  await startDb(); // Initialiser la connexion à la base de données

  // const products = await ProductModel.find().sort("-createdAt").limit(20); // Récupérer les 20 derniers produits créés
  //*********************** */
  const products = await ProductModel.find().sort("-createdAt"); // Récuperer tous les produits sans limiter
  //*********************** */

  const productList = products.map((product) => {
    // Mapper les données des produits en une structure cohérente
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

  return JSON.stringify(productList); // Retourner la liste des produits sous forme de chaîne JSON
};

// Fonction pour récupérer les produits en vedette à partir de la base de données
const fetchFeaturedProducts = async () => {
  await startDb(); // Initialiser la connexion à la base de données
  const products = await FeaturedProductModel.find().sort("-createdAt"); // Récupérer les produits en vedette par date de création

  return products.map((product) => {
    // Mapper les données des produits en vedette en une structure cohérente
    return {
      id: product._id.toString(),
      title: product.title,
      banner: product.banner.url,
      link: product.link,
      linkTitle: product.linkTitle,
    };
  });
};

// Composant de la page d'accueil
export default async function Home() {
  // Récupérer les produits les plus récents
  const latestProducts = await fetchLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[];

  // Récupérer les produits en vedette
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <div className="space-y-4 ">
      <FeaturedProductsSlider products={featuredProducts} />{" "}
      {/* Composant du curseur de produits en vedette */}
      <CategoryMenu /> {/* Composant du menu de catégories */}
      <GridView>
        {parsedProducts.map((product) => {
          // Mapper et afficher les derniers produits dans une grille
          return <ProductCard key={product.id} product={product} />;
        })}
      </GridView>
    </div>
  );
}
