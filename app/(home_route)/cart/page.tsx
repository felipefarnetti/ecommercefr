// Importer les dépendances nécessaires

import CartItems from "@components/CartItems";
import startDb from "@lib/db";
import CartModel from "@models/cartModel";
import { auth } from "@/auth";
import { Types } from "mongoose";
import React from "react";

// Fonction asynchrone pour récupérer les produits dans le panier de l'utilisateur
const fetchCartProducts = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  await startDb();
  const [cartItems] = await CartModel.aggregate([
    { $match: { userId: new Types.ObjectId(session.user.id) } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        foreignField: "_id",
        localField: "items.productId",
        as: "product",
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        totalQty: { $sum: "$items.quantity" },
        products: {
          id: { $toString: { $arrayElemAt: ["$product._id", 0] } },
          thumbnail: { $arrayElemAt: ["$product.thumbnail.url", 0] },
          title: { $arrayElemAt: ["$product.title", 0] },
          price: { $arrayElemAt: ["$product.price.discounted", 0] },
          qty: "$items.quantity",
          totalPrice: {
            $multiply: [
              "$items.quantity",
              { $arrayElemAt: ["$product.price.discounted", 0] },
            ],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        id: { $first: "$id" },
        totalQty: { $sum: "$totalQty" },
        totalPrice: { $sum: "$products.totalPrice" },
        products: { $push: "$products" },
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        totalQty: 1,
        totalPrice: 1,
        products: 1,
      },
    },
  ]);

  return cartItems;
};

// Page du panier
export default async function Cart() {
  const cart = await fetchCartProducts();

  if (!cart)
    return (
      <div className="py-4">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Détails de votre panier</h1>
          <hr />
        </div>
        <h1 className="text-center font-semibold text-2xl opacity-40 py-10">
          Votre panier est vide !
        </h1>
      </div>
    );

  return (
    <CartItems
      cartTotal={cart.totalPrice}
      cartId={cart.id}
      products={cart.products}
      totalQty={cart.totalQty}
    />
  );
}
