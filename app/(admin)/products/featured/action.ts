"use server";
import startDb from "@lib/db";
import { FeaturedProductForUpdate, NewFeaturedProduct } from "@app/types";
import FeaturedProductModel from "@models/featuredProduct";
import { removeImageFromCloud } from "../action";

// Créer un produit vedette
export const createFeaturedProduct = async (info: NewFeaturedProduct) => {
  try {
    // Connecter à la base de données
    await startDb();

    // Créer le produit vedette dans la base de données
    await FeaturedProductModel.create({ ...info });
  } catch (error) {
    // Gérer l'erreur
    throw error;
  }
};

// Mettre à jour un produit vedette
export const updateFeaturedProduct = async (
  id: string,
  info: FeaturedProductForUpdate
) => {
  try {
    // Connecter à la base de données
    await startDb();

    // Mettre à jour le produit vedette dans la base de données
    await FeaturedProductModel.findByIdAndUpdate(id, { ...info });
  } catch (error) {
    // Gérer l'erreur
    throw error;
  }
};

// Supprimer un produit vedette
export const deleteFeaturedProduct = async (id: string) => {
  try {
    // Connecter à la base de données
    await startDb();

    // Obtenir le produit vedette à supprimer
    const product = await FeaturedProductModel.findByIdAndDelete(id);

    // Si le produit vedette existe, supprimer son image du cloud
    if (product) {
      await removeImageFromCloud(product.banner.id);
    }
  } catch (error) {
    // Gérer l'erreur
    throw error;
  }
};
