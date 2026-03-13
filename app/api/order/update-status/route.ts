// Importation des dépendances nécessaires
import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

// Statuts de livraison valides
const validStatus = ["delivered", "ordered", "shipped"];

export const POST = async (req: Request) => {
  // Authentification de la session utilisateur
  const session = await auth();
  const user = session?.user;

  // Vérification du rôle de l'utilisateur
  if (user?.role !== "admin") {
    // Réponse d'erreur en cas de demande non autorisée
    return NextResponse.json(
      { error: "Demande non autorisée!" },
      { status: 401 }
    );
  }

  // Récupération de l'ID de la commande et du statut de livraison depuis la requête
  const { orderId, deliveryStatus } = await req.json();

  // Validation de l'ID de la commande et du statut de livraison
  if (!isValidObjectId(orderId) || !validStatus.includes(deliveryStatus)) {
    // Réponse d'erreur en cas de données invalides
    return NextResponse.json({ error: "Données invalides!" }, { status: 401 });
  }

  // Connexion à la base de données
  await startDb();

  // Mise à jour du statut de livraison de la commande dans la base de données
  await OrderModel.findByIdAndUpdate(orderId, { deliveryStatus });

  // Réponse de succès
  return NextResponse.json({ success: true });
};
