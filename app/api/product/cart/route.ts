// Importation des dépendances nécessaires
import startDb from "@lib/db";
import CartModel from "@models/cartModel";
import { NewCartRequest } from "@app/types";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // Authentification de la session utilisateur
    const session = await auth();
    const user = session?.user;

    // Vérification de l'utilisateur authentifié
    if (!user) {
      return NextResponse.json(
        { error: "Requête non autorisée!" },
        { status: 401 }
      );
    }

    // Récupération des données de la requête
    const { productId, quantity } = (await req.json()) as NewCartRequest;

    // Validation de l'ID du produit et de la quantité
    if (!isValidObjectId(productId) || isNaN(quantity)) {
      return NextResponse.json({ error: "Requête invalide!" }, { status: 401 });
    }

    // Connexion à la base de données
    await startDb();

    // Recherche du panier de l'utilisateur
    const cart = await CartModel.findOne({ userId: user.id });

    if (!cart) {
      // Création d'un nouveau panier s'il n'existe pas
      await CartModel.create({
        userId: user.id,
        items: [{ productId, quantity }],
      });
      return NextResponse.json({ success: true });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Mise à jour de la quantité si l'élément existe déjà
      existingItem.quantity += quantity;

      if (existingItem.quantity <= 0) {
        // Suppression de l'élément (produit) si la quantité devient nulle
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      // Ajout d'un nouvel élément s'il n'existe pas
      cart.items.push({ productId: productId as any, quantity });
    }

    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
