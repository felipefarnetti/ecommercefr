// Importation des dépendances nécessaires
import { getCartItems } from "@lib/cartHelper"; // Importation de la fonction pour récupérer les articles du panier
import { auth } from "@/auth"; // Importation de la fonction d'authentification de l'utilisateur
import { isValidObjectId } from "mongoose"; // Importation de la fonction pour vérifier si un ID est valide
import { NextResponse } from "next/server"; // Importation de NextResponse pour gérer la réponse HTTP
import Stripe from "stripe"; // Importation de la bibliothèque Stripe pour les paiements

// Initialisation de la bibliothèque Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

// Fonction de gestion de la requête POST
export const POST = async (req: Request) => {
  try {
    const session = await auth(); // Authentification de l'utilisateur
    if (!session?.user) {
      // Vérification de la session utilisateur
      return NextResponse.json(
        {
          error: "Demande non autorisée!",
        },
        { status: 401 }
      );
    }

    const data = await req.json();
    const cartId = data.cartId as string;

    if (!isValidObjectId(cartId)) {
      // Vérification de la validité de l'ID du panier
      return NextResponse.json(
        {
          error: "ID de panier non valide!",
        },
        { status: 401 }
      );
    }

    // Récupération des détails du panier
    const cartItems = await getCartItems(session.user.id, cartId);
    if (!cartItems) {
      // Vérification de l'existence du panier
      return NextResponse.json(
        {
          error: "Panier introuvable!",
        },
        { status: 404 }
      );
    }

    const line_items = cartItems.products.map((product) => {
      // Préparation des éléments de ligne pour le paiement
      return {
        price_data: {
          currency: "EUR",
          unit_amount: product.price * 100, // Le montant est converti en centimes
          product_data: {
            name: product.title,
            images: [product.thumbnail],
          },
        },
        quantity: product.qty,
      };
    });

    const customer = await stripe.customers.create({
      metadata: {
        userId: session.user.id,
        cartId: cartId,
        type: "checkout",
      },
    });

    // Génération du lien de paiement et redirection vers l'application frontend
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
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
