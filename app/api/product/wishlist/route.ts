// Importation des dépendances nécessaires
import WishlistModel from "@models/wishlistModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth();

  // Vérification de l'authentification de l'utilisateur
  if (!session?.user)
    return NextResponse.json(
      { error: "Requête non autorisée!" },
      { status: 403 }
    );

  // Récupération de l'ID du produit depuis les données de la requête
  const { productId } = await req.json();

  // Validation de l'ID du produit
  if (!isValidObjectId(productId))
    return NextResponse.json(
      { error: "ID de produit invalide!" },
      { status: 422 }
    );

  // Recherche de l'élément correspondant dans la liste de souhaits de l'utilisateur
  const wishlist = await WishlistModel.findOne({
    user: session.user.id,
    products: productId,
  });

  // Si l'élément est déjà dans la liste de souhaits, le retirer
  if (wishlist) {
    await WishlistModel.findByIdAndUpdate(wishlist._id, {
      $pull: { products: productId },
    });
  } else {
    // Sinon, ajouter l'élément à la liste de souhaits de l'utilisateur
    await WishlistModel.findOneAndUpdate(
      {
        user: session.user.id,
      },
      {
        user: session.user.id,
        $push: { products: productId },
      },
      { upsert: true }
    );
  }

  return NextResponse.json({ success: true });
};
