// Importation des dépendances nécessaires
import ProductModel from "@models/productModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialisation de la bibliothèque Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// Fonction de gestion de la requête POST
export const POST = async (req: Request) => {
  try {
    // Authentification de l'utilisateur
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Demande non autorisée!",
        },
        { status: 401 }
      );
    }

    const data = await req.json();
    // Récupération des données envoyées dans la requête

    const productId = data.productId as string;

    if (!isValidObjectId(productId)) {
      // Vérification de la validité de l'ID du produit
      return NextResponse.json(
        {
          error: "ID de produit non valide!",
        },
        { status: 401 }
      );
    }

    // Récupération des détails du produit depuis la base de données
    const product = await ProductModel.findById(productId);
    if (!product) {
      // Vérification si le produit existe
      return NextResponse.json(
        {
          error: "Produit introuvable!",
        },
        { status: 404 }
      );
    }

    const line_items = {
      // Préparation des éléments de ligne pour le paiement
      price_data: {
        currency: "EUR",
        unit_amount: product.price.discounted * 100, // Le montant est converti en centimes
        product_data: {
          name: product.title,
          images: [product.thumbnail.url],
        },
      },
      quantity: 1,
    };

    // Création d'un client Stripe avec des métadonnées
    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        type: "instant-checkout",
        product: JSON.stringify({
          id: productId,
          title: product.title,
          price: product.price.discounted,
          totalPrice: product.price.discounted,
          thumbnail: product.thumbnail.url,
          qty: 1,
        }),
      },
    });

    // Génération du lien de paiement et redirection vers l'application frontend
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [line_items],
      success_url: process.env.PAYMENT_SUCCESS_URL!, // URL de succès
      cancel_url: process.env.PAYMENT_CANCEL_URL!, // URL d'annulation
      shipping_address_collection: { allowed_countries: ["FR"] }, // Collecte de l'adresse de livraison
      customer: customer.id, // ID du client
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Renvoi de l'URL du paiement généré
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    // Gestion des erreurs
    return NextResponse.json(
      {
        error:
          "Une erreur s'est produite, impossible de finaliser le paiement!",
      },
      { status: 500 }
    );
  }
};
