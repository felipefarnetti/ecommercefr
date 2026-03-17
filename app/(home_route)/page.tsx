import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import FeaturedProductsSlider from "@components/FeaturedProductsSlider";
import FeaturedProductModel from "@models/featuredProduct";
import CategoryMenu from "@components/CategoryMenu";

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

const fetchLatestProducts = async () => {
  await startDb();
  const products = await ProductModel.find().sort("-createdAt");

  return products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    category: product.category,
    thumbnail: product.thumbnail.url,
    price: product.price,
    sale: product.sale,
    rating: product.rating,
  }));
};

const fetchFeaturedProducts = async () => {
  await startDb();
  const products = await FeaturedProductModel.find().sort("-createdAt");

  return products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    banner: product.banner.url,
    link: product.link,
    linkTitle: product.linkTitle,
  }));
};

export default async function Home() {
  const [latestProducts, featuredProducts] = await Promise.all([
    fetchLatestProducts(),
    fetchFeaturedProducts(),
  ]);

  return (
    <div className="space-y-10 animate-slide-up">
      <FeaturedProductsSlider products={featuredProducts} />

      {/* Categories */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-3 px-4">
          Catégories
        </h2>
        <CategoryMenu />
      </section>

      {/* Products */}
      <section>
        <div className="px-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Nos produits
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Découvrez notre sélection
          </p>
        </div>
        <GridView>
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </GridView>
      </section>
    </div>
  );
}
