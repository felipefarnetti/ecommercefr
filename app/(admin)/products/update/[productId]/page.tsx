// Importer les dépendances nécessaires
import UpdateProduct from "@components/UpdateProduct";
import startDb from "@lib/db";
import ProductModel from "@app/models/productModel";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";
import { ProductResponse } from "@app/types";

// Interface pour les paramètres de la page
interface Props {
  params: {
    productId: string;
  };
}

// Obtenir les informations sur un produit
const fetchProductInfo = async (productId: string): Promise<string> => {
  // Vérifier si l'identifiant du produit est valide
  if (!isValidObjectId(productId)) {
    return redirect("/404");
  }

  // Connecter à la base de données
  await startDb();

  // Obtenir le produit à partir de la base de données
  const product = await ProductModel.findById(productId);

  // Vérifier si le produit existe
  if (!product) {
    return redirect("/404");
  }

  // Convertir le produit en un objet de réponse
  const finalProduct: ProductResponse = {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    quantity: product.quantity,
    price: product.price,
    bulletPoints: product.bulletPoints,
    images: product.images?.map(({ url, id }) => ({ url, id })),
    thumbnail: product.thumbnail,
    category: product.category,
  };

  // Renvoyer les informations sur le produit
  return JSON.stringify(finalProduct);
};

// Afficher le formulaire de mise à jour d'un produit
export default async function UpdatePage(props: Props) {
  // Obtenir l'identifiant du produit à mettre à jour
  const { productId } = props.params;

  // Obtenir les informations sur le produit à mettre à jour
  const product = await fetchProductInfo(productId);

  // Renvoyer le formulaire de mise à jour du produit
  return (
    <div>
      <UpdateProduct product={JSON.parse(product)} />
    </div>
  );
}
