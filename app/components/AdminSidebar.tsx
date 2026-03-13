"use client";

// Importation des dépendances nécessaires
import Link from "next/link";
import React, { ReactNode } from "react";
import {
  Squares2X2Icon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  SparklesIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "@components/SignOutButton";

// Interface pour les propriétés (props) du composant
interface Props {
  children: ReactNode;
}

// Composant de la barre latérale d'administration
const AdminSidebar = ({ children }: Props) => {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between bg-cyan-600 h-screen sticky top-0 w-36 p-4">
        <ul className="space-y-4 text-white">
          <li>
            <Link
              className="font-semibold text-lg text-white"
              href="/dashboard"
            >
              Backoffice
            </Link>
          </li>
          <li>
            <Link className="flex items-center space-x-1" href="/dashboard">
              <Squares2X2Icon className="w-4 h-4" />
              <span>Backoffice</span>
            </Link>
            <hr className="w-full " />
          </li>
          <li>
            <Link className="flex items-center space-x-1" href="/products">
              <ShoppingCartIcon className="w-4 h-4" />
              <span>Produits</span>
            </Link>
            <hr className="w-full " />
          </li>
          <li>
            <Link
              className="flex items-center space-x-1"
              href="/products/featured/add"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Publicité</span>
            </Link>
            <hr className="w-full" />
          </li>
          <li>
            <Link className="flex items-center space-x-1" href="/sales">
              <CurrencyDollarIcon className="w-4 h-4" />
              <span>Ventes</span>
            </Link>
            <hr className="w-full" />
          </li>
          <li>
            <Link className="flex items-center space-x-1" href="/orders">
              <ShoppingBagIcon className="h-4 w-4" />
              <span>Commandes</span>
            </Link>
            <hr className="w-full mb-10" />
          </li>
          <li>
            <SignOutButton>
              <div className="cursor-pointer text-white mb-2 ml-1">Logout</div>
            </SignOutButton>
          </li>
          <li>
            <Link className="cursor-pointer" href="/">
              <button className="w-16 h-8 mt-4 text-black bg-white border-black border rounded-md">
                Retour
              </button>
            </Link>
          </li>
        </ul>
      </div>
      <div className="max-w-screen-xl mx-auto flex-1 p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminSidebar;
