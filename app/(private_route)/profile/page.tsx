// Importation des dépendances nécessaires
import EmailVerificationBanner from "@components/EmailVerificationBanner";
import ProfileForm from "@components/ProfileForm";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import OrderModel from "@models/orderModel";
import OrderListPublic, { Orders } from "@components/OrderListPublic";

// Fonction pour récupérer les dernières commandes de l'utilisateur
const fetchLastestOrders = async () => {
  const session = await auth();

  // Vérifie si l'utilisateur est authentifié
  if (!session?.user) {
    if (!session) return redirect("/auth/signin");
  }

  // Initialisation de la base de données
  await startDb();

  // Récupération des commandes de l'utilisateur triées par date et limitées aux 3 dernières
  const orders = await OrderModel.find({ userId: session.user.id })
    .sort("-createdAt")
    .limit(4);

  // Transformation des commandes en un format adapté à l'interface utilisateur
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

  return JSON.stringify(result);
};

// Fonction pour récupérer le profil de l'utilisateur
const fetchUserProfile = async () => {
  const session = await auth();
  // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!session) return redirect("/auth/signin");

  // Initialisation de la base de données
  await startDb();

  // Récupération du profil de l'utilisateur
  const user = await UserModel.findById(session.user.id);
  // Redirige vers la page de connexion si le profil n'est pas trouvé
  if (!user) return redirect("/auth/signin");

  // Formatage des informations du profil
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar?.url,
    verified: user.verified,
  };
};

// Composant principal de la page de profil de l'utilisateur
export default async function Profile() {
  // Récupération du profil de l'utilisateur et de ses commandes récentes
  const profile = await fetchUserProfile();
  const order = JSON.parse(await fetchLastestOrders());

  return (
    <div>
      {/* Bannière de vérification par e-mail */}
      <EmailVerificationBanner verified={profile.verified} id={profile.id} />

      {/* Contenu de la page de profil */}
      <div className="flex py-4 space-y-4 flex-col md:flex-row">
        {/* Formulaire de profil de l'utilisateur */}
        <div className="p-4 space-y-4">
          <ProfileForm
            id={profile.id}
            email={profile.email}
            name={profile.name}
            avatar={profile.avatar}
          />
        </div>

        {/* Liste des commandes récentes de l'utilisateur */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase opacity-70 mb-4">
              Vos commandes récentes
            </h1>
            <Link
              href="/profile/orders"
              className="uppercase hover:underline text-center bg-blue-gray-100 border border-blue-gray-400 rounded p-1"
            >
              Voir toutes les commandes
            </Link>
          </div>
          <OrderListPublic orders={order} />
        </div>
      </div>
    </div>
  );
}
