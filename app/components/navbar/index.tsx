// Importation des dépendances nécessaires
import React from "react";
import NavUI from "./NavUi"; // Composant de l'interface utilisateur de la barre de navigation
import { auth } from "@/auth"; // Authentification de l'utilisateur
import CartModel from "@models/cartModel"; // Modèle de panier
import { Types } from "mongoose"; // Types Mongoose pour les requêtes MongoDB
import { redirect } from "next/navigation"; // Redirection dans l'application Next.js
import startDb from "@lib/db"; // Initialisation de la base de données
import UserModel from "@models/userModel"; // Modèle de l'utilisateur

// Fonction pour récupérer le profil de l'utilisateur
const fetchUserProfile = async () => {
  const session = await auth(); // Authentification de l'utilisateur
  if (!session) return null;

  await startDb(); // Initialisation de la base de données
  const user = await UserModel.findById(session.user.id); // Recherche de l'utilisateur par ID
  if (!user) return redirect("/auth/signin"); // Redirection vers la page de connexion si l'utilisateur n'existe pas
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar?.url, // Lien vers l'avatar de l'utilisateur (s'il existe)
    verified: user.verified, // Statut de vérification de l'utilisateur
  };
};

// Fonction pour récupérer le nombre d'articles dans le panier de l'utilisateur
const getCartItemsCount = async () => {
  try {
    const session = await auth(); // Authentification de l'utilisateur
    if (!session?.user) return 0;

    const userId = session.user.id;

    const cart = await CartModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } }, // Filtrage du panier par ID de l'utilisateur
      { $unwind: "$items" },
      {
        $group: {
          _id: "$_id",
          totalQuantity: { $sum: "$items.quantity" }, // Calcul du nombre total d'articles dans le panier
        },
      },
    ]);
    if (cart.length) {
      return cart[0].totalQuantity; // Retourne la quantité totale d'articles dans le panier
    } else {
      return 0; // Retourne 0 s'il n'y a pas d'articles dans le panier
    }
  } catch (error) {
    console.log(
      "Erreur lors de la récupération du nombre d'articles dans le panier:",
      error
    );
    return 0; // En cas d'erreur, retourne 0
  }
};

export default async function NavBar() {
  const cartItemsCount = await getCartItemsCount(); // Récupère le nombre d'articles dans le panier
  const profile = await fetchUserProfile(); // Récupère le profil de l'utilisateur
  return (
    <div>
      <NavUI cartItemsCount={cartItemsCount} avatar={profile?.avatar} />
      {/* Affiche l'interface utilisateur de la barre de navigation avec le nombre d'articles dans le panier et l'avatar de l'utilisateur */}
    </div>
  );
}
