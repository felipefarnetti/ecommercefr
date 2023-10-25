// Importation des dépendances nécessaires
import { getCartItems } from "@lib/cartHelper";
import CartModel from "@models/cartModel";
import OrderModel from "@models/orderModel";
import ProductModel from "@models/productModel";
import { CartProduct, StripeCustomer } from "@/app/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();
  // console.log("data=========webhook", data);

  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    // Vérification de la signature et décodage de l'événement Stripe
    event = await stripe.webhooks.constructEvent(
      data,
      signature,
      webhookSecret
    );
  } catch (error) {
    // En cas d'erreur de vérification
    // console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      {
        status: 400,
      }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const stripeSession = event.data.object as {
        customer: string;
        payment_intent: string;
        amount_subtotal: number;
        customer_details: any;
        payment_status: string;
      };
      // console.log("Received checkout.session.completed event:", stripeSession);

      const customer = (await stripe.customers.retrieve(
        stripeSession.customer
      )) as unknown as StripeCustomer;

      const { cartId, userId, type, product } = customer.metadata;

      // Création d'une nouvelle commande si le type est "checkout"
      if (type === "checkout") {
        const cartItems = await getCartItems(userId, cartId);
        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,
          deliveryStatus: "commandé",
          orderItems: cartItems.products,
        });

        // Mise à jour des stocks des produits
        const updateProductPromises = cartItems.products.map(
          async (product) => {
            return await ProductModel.findByIdAndUpdate(product.id, {
              $inc: { quantity: -product.qty },
            });
          }
        );

        await Promise.all(updateProductPromises);

        // Suppression du panier
        await CartModel.findByIdAndDelete(cartId);
      }

      // Création d'une commande instantanée si le type est "instant-checkout"
      if (type === "instant-checkout") {
        const productInfo = JSON.parse(product) as unknown as CartProduct;
        await OrderModel.create({
          userId,
          stripeCustomerId: stripeSession.customer,
          paymentIntent: stripeSession.payment_intent,
          totalAmount: stripeSession.amount_subtotal / 100,
          shippingDetails: {
            address: stripeSession.customer_details.address,
            email: stripeSession.customer_details.email,
            name: stripeSession.customer_details.name,
          },
          paymentStatus: stripeSession.payment_status,
          deliveryStatus: "commandé",
          orderItems: [{ ...productInfo }],
        });

        // Mise à jour du stock du produit
        await ProductModel.findByIdAndUpdate(productInfo.id, {
          $inc: { quantity: -1 },
        });
      }
    }

    // Réponse de succès
    return NextResponse.json({});
  } catch (error) {
    // Gestion des erreurs
    // console.error("Error processing webhook event:", error);
    return NextResponse.json(
      {
        error:
          "Quelque chose s'est mal passé, impossible de créer la commande!",
      },
      { status: 500 }
    );
  }
};
