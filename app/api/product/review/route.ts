// Importation des dépendances nécessaires
import { ReviewRequestBody } from "@app/types";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Types, isValidObjectId } from "mongoose";
import startDb from "@lib/db";
import ReviewModel from "@models/reviewModel";
import ProductModel from "@models/productModel";

export const POST = async (req: Request) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Requête non autorisée!" },
        { status: 401 }
      );
    }

    // Récupération des données de la requête
    const { productId, comment, rating } =
      (await req.json()) as ReviewRequestBody;

    // Validation de l'ID du produit
    if (!isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "ID de produit invalide!" },
        { status: 401 }
      );
    }

    // Validation de la note/rating
    if (rating <= 0 || rating > 5) {
      return NextResponse.json({ error: "Note invalide!" }, { status: 401 });
    }

    const userId = session.user.id;

    const data = {
      userId,
      rating,
      comment,
      product: productId,
    };

    // Connexion à la base de données
    await startDb();

    // Recherche d'une évaluation existante de l'utilisateur pour le produit
    await ReviewModel.findOneAndUpdate({ userId, product: productId }, data, {
      upsert: true,
    });

    // Mise à jour de la note moyenne du produit
    await updateProductRating(productId);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Une erreur s'est produite, impossible de mettre à jour l'évaluation !",
      },
      { status: 401 }
    );
  }
};

const updateProductRating = async (productId: string) => {
  const [result] = await ReviewModel.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result?.averageRating) {
    // Mise à jour de la note du produit
    await ProductModel.findByIdAndUpdate(productId, {
      rating: result.averageRating,
    });
  }
};
