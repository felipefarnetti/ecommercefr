// Importer les composants nécessaires
import OrderModel from "@models/orderModel";
import startDb from "@lib/db";
import React from "react";
import OrderCard, { Order } from "@components/OrderCard";
import { ObjectId } from "mongoose";

// Obtenir les commandes
const fetchOrders = async () => {
  // Connecter à la base de données
  await startDb();

  // Obtenir les commandes triées par date de création décroissante et limitées à 5
  // Inclure l'utilisateur associé à chaque commande
  const orders = await OrderModel.find().sort("-createdAt").limit(10).populate<{
    userId: {
      _id: ObjectId;
      name: string;
      email: string;
      avatar?: { url: string };
      createdAt: Date;
    };
  }>({
    path: "userId",
    select: "name email avatar",
  });

  // Convertir les commandes en un tableau d'objets Order
  const result: Order[] = orders.map((order): Order => {
    return {
      id: order._id.toString(),
      deliveryStatus: order.deliveryStatus,
      subTotal: order.totalAmount,
      createdAt: order.createdAt,
      customer: {
        id: order.userId._id.toString(),
        name: order.userId.name,
        email: order.userId.email,
        address: order.shippingDetails.address,
        avatar: order.userId.avatar?.url,
      },
      products: order.orderItems,
    };
  });

  // Renvoyer le tableau d'objets converti en JSON
  return JSON.stringify(result);
};

// Afficher la liste des commandes
export default async function Orders() {
  // Obtenir les commandes
  const result = await fetchOrders();
  const orders = JSON.parse(result) as Order[];

  // Renvoyer la liste des commandes
  return (
    <div className="py-4 space-y-4">
      {orders.map((order) => {
        return <OrderCard order={order} key={order.id} disableUpdate={false} />;
      })}
    </div>
  );
}
