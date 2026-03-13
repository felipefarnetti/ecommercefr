"use server";

// Importation des dépendances nécessaires
import startDb from "@lib/db";
import { UserProfileToUpdate } from "@app/types";
import UserModel from "@models/userModel";

// Fonction pour mettre à jour le profil utilisateur
export const UpdateUserProfile = async (info: UserProfileToUpdate) => {
  try {
    // Initialisation de la base de données
    await startDb();

    // Mise à jour du modèle utilisateur avec les nouvelles informations
    await UserModel.findByIdAndUpdate(info.id, {
      nom: info.name,
      avatar: info.avatar,
    });
  } catch (error) {
    // En cas d'erreur lors de la mise à jour de l'utilisateur, l'erreur est renvoyée
    throw error;
  }
};
