// Importer les dépendances nécessaires
import ReviewForm from "@components/ReviewForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import ReviewModel from "@models/reviewModel";
import Image from "next/image";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";

// Interface définissant les propriétés attendues
interface Props {
  params: { id: string };
}

// Fonction asynchrone pour récupérer l'avis de l'utilisateur sur le produit
const fetchReview = async (productId: string) => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/auth/signin");
  }

  await startDb();
  const review = await ReviewModel.findOne({
    userId: session.user.id,
    product: productId,
  }).populate<{ product: { title: string; thumbnail: { url: string } } }>({
    path: "product",
    select: "title thumbnail.url",
  });

  if (review) {
    return {
      id: review._id.toString(),
      rating: review.rating,
      comment: review.comment,
      product: {
        title: review.product.title,
        thumbnail: review.product.thumbnail.url,
      },
    };
  }
};

// Fonction asynchrone pour récupérer les informations du produit
const fetchProductInfo = async (productId: string) => {
  await startDb();
  const product = await ProductModel.findById(productId);
  if (!product) return redirect("/404");

  return {
    title: product.title,
    thumbnail: product.thumbnail.url,
  };
};

// Page de soumission d'avis sur un produit
export default async function Review({ params }: Props) {
  const productId = params.id;
  const review = await fetchReview(productId);
  const product = await fetchProductInfo(productId);

  const initialValue = review
    ? { comment: review.comment || "", rating: review.rating }
    : undefined;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={80}
          height={80}
          className="rounded"
        />
        <h3 className="font-semibold">{product.title}</h3>
      </div>
      <ReviewForm productId={productId} initialValue={initialValue} />
    </div>
  );
}
