// Importer les composants nécessaires
import RecentOrdersList, { RecentOrders } from "@components/RecentOrdersList";
import RecentReviewsList, {
  RecentReviews,
} from "@components/RecentReviewsList";
import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import ReviewModel from "@models/reviewModel";
import { ObjectId } from "mongoose";
import React from "react";

// Obtenir les commandes récentes
const fetchRecentOrders = async () => {
  // Connecter à la base de données
  await startDb();

  // Obtenir les commandes payées, triées par date de création décroissante et limitées à 5
  const orders = await OrderModel.find({ paymentStatus: "payé" })
    .sort("-createdAt")
    .limit(5);

  // Convertir les commandes en un tableau d'objets RecentOrders
  const result = orders.map((order): RecentOrders => {
    return {
      id: order._id.toString(),
      customerInfo: {
        name: order.shippingDetails.name,
      },
      products: order.orderItems,
    };
  });

  // Renvoyer le tableau d'objets converti en JSON
  return JSON.stringify(result);
};

// Obtenir les avis récents
const fetchRecentReviews = async () => {
  // Connecter à la base de données
  await startDb();

  // Obtenir les avis triés par date de création décroissante et limités à 10
  // Inclure le produit et l'utilisateur associés à chaque avis
  const reviews = await ReviewModel.find()
    .sort("-createdAt")
    .limit(10)
    .populate<{
      product: {
        _id: ObjectId;
        title: string;
        thumbnail: { url: string };
      };
    }>({
      path: "product",
      select: "title thumbnail.url",
    })
    .populate<{ userId: { name: string } }>({
      path: "userId",
      select: "name",
    });

  // Convertir les avis en un tableau d'objets RecentReviews
  const result = reviews.map((review): RecentReviews => {
    return {
      id: review._id.toString(),
      date: review.createdAt.toString(),
      rating: review.rating,
      product: {
        id: review.product?._id.toString(),
        title: review.product?.title,
        thumbnail: review.product?.thumbnail.url,
      },
      user: { name: review.userId.name },
    };
  });

  // Renvoyer le tableau d'objets converti en JSON
  return JSON.stringify(result);
};

// Afficher le tableau de bord
export default async function Dashboard() {
  // Obtenir les commandes récentes
  const orders = JSON.parse(await fetchRecentOrders());

  // Obtenir les avis récents
  const reviews = JSON.parse(await fetchRecentReviews());

  // Renvoyer le composant Dashboard
  return (
    <div className="flex space-x-6">
      <RecentOrdersList orders={orders} />
      <RecentReviewsList reviews={reviews} />
    </div>
  );
}
