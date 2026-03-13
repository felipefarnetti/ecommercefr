"use server";

// Importer les dépendances nécessaires
import startDb from "@lib/db";
import ProductModel, { NewProduct } from "@app/models/productModel";
import { ProductToUpdate } from "@app/types";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const getCloudConfig = async () => {
  return {
    name: process.env.CLOUD_NAME!,
    key: process.env.CLOUD_API_KEY!,
  };
};

// générer notre signature cloud
export const getCloudSignature = async () => {
  const secret = cloudinary.config().api_secret!;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, secret);

  return { timestamp, signature };
};

// créer un produit
export const createProduct = async (info: NewProduct) => {
  try {
    // Connecter à la base de données
    await startDb();

    // Créer le produit dans la base de données
    await ProductModel.create({ ...info });
  } catch (error) {
    // Gérer l'erreur
    console.log((error as any).message);
    throw new Error(
      "Quelque chose s'est mal passé, impossible de créer le produit !"
    );
  }
};

// supprimer une image du cloud
export const removeImageFromCloud = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

// supprimer et mettre à jour l'image d'un produit
export const removeAndUpdateProductImage = async (
  id: string,
  publicId: string
) => {
  try {
    // Supprimer l'image du cloud
    const { result } = await cloudinary.uploader.destroy(publicId);

    // Si la suppression de l'image du cloud a réussi
    if (result === "ok") {
      // Connecter à la base de données
      await startDb();

      // Supprimer l'image de la base de données
      await ProductModel.findByIdAndUpdate(id, {
        $pull: { images: { id: publicId } },
      });
    }
  } catch (error) {
    // Gérer l'erreur
    console.log(
      "Erreur lors de la suppression de l'image du cloud :",
      (error as any).message
    );
    throw error;
  }
};

// mettre à jour un produit
export const updateProduct = async (
  id: string,
  productInfo: ProductToUpdate
) => {
  try {
    // Connecter à la base de données
    await startDb();

    // Obtenir les images du produit
    let images: typeof productInfo.images = [];
    if (productInfo.images) {
      images = productInfo.images;
    }

    // Supprimer les images du produit
    delete productInfo.images;

    // Mettre à jour le produit dans la base de données
    await ProductModel.findByIdAndUpdate(id, {
      ...productInfo,
      $push: { images },
    });
  } catch (error) {
    // Gérer l'erreur
    console.log(
      "Erreur lors de la mise à jour du produit, ",
      (error as any).message
    );
    throw error;
  }
};
