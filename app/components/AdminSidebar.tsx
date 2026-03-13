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
      <div className="flex flex-col justify-between bg-slate-900 h-screen sticky top-0 w-44 p-4">
        <div>
          <Link
            className="font-bold text-lg text-white block mb-6 px-2"
            href="/dashboard"
          >
            Backoffice
          </Link>

          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2 px-2">Navigation</p>
          <ul className="space-y-1">
            <li>
              <Link className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors" href="/dashboard">
                <Squares2X2Icon className="w-4 h-4" />
                <span>Backoffice</span>
              </Link>
            </li>
            <li>
              <Link className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors" href="/products">
                <ShoppingCartIcon className="w-4 h-4" />
                <span>Produits</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors"
                href="/products/featured/add"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Publicité</span>
              </Link>
            </li>
            <li>
              <Link className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors" href="/sales">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>Ventes</span>
              </Link>
            </li>
            <li>
              <Link className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors" href="/orders">
                <ShoppingBagIcon className="h-4 w-4" />
                <span>Commandes</span>
              </Link>
            </li>
          </ul>

          <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mt-6 mb-2 px-2">Compte</p>
          <ul className="space-y-1">
            <li>
              <SignOutButton>
                <div className="cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors">Logout</div>
              </SignOutButton>
            </li>
            <li>
              <Link className="cursor-pointer" href="/">
                <span className="block text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2 transition-colors text-sm">
                  Retour
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto flex-1 p-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminSidebar;
