// Importation des composants nécessaires

import OrderListPublic, { Orders } from "@components/OrderListPublic";
import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

// Fonction pour récupérer les commandes de l'utilisateur

const fetchOrders = async () => {
  const session = await auth();

  // Si l'utilisateur n'est pas connecté, renvoyer null
  if (!session?.user) {
    return null;
  }

  // Initialisation de la base de données
  await startDb();
  const orders = await OrderModel.find({ userId: session.user.id }).sort(
    "-createdAt"
  );

  // Transformation des commandes en un format adapté pour l'affichage
  const result: Orders[] = orders.map((order) => {
    // console.log(order);
    return {
      id: order._id.toString(),
      paymentStatus: order.paymentStatus,
      date: order.createdAt.toString(),
      total: order.totalAmount,
      deliveryStatus: order.deliveryStatus,
      products: order.orderItems,
    };
  });

  // Conversion des résultats en format JSON
  return JSON.stringify(result);
};

export default async function Order() {
  const result = await fetchOrders();

  // Si aucune commande n'a été trouvée, rediriger vers la page d'erreur 404
  if (!result) {
    return redirect("/404");
  }

  // Affichage de la liste des commandes
  return (
    <div>
      <OrderListPublic orders={JSON.parse(result)} />
    </div>
  );
}
