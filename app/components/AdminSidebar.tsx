"use client";

import Link from "next/link";
import React, { ReactNode, useState } from "react";
import {
  Squares2X2Icon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  SparklesIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "@components/SignOutButton";

interface Props {
  children: ReactNode;
}

const navLinks = [
  { href: "/dashboard", icon: Squares2X2Icon, label: "Dashboard" },
  { href: "/products", icon: ShoppingCartIcon, label: "Produits" },
  { href: "/products/featured/add", icon: SparklesIcon, label: "Publicité" },
  { href: "/sales", icon: CurrencyDollarIcon, label: "Ventes" },
  { href: "/orders", icon: ShoppingBagIcon, label: "Commandes" },
];

const AdminSidebar = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 md:hidden">
        <Link href="/dashboard" className="font-bold text-lg text-white">
          Backoffice
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-slate-900 p-4 pt-16 md:pt-4 transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:min-h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <Link
              className="font-bold text-lg text-white block mb-6 px-2 hidden md:block"
              href="/dashboard"
            >
              Backoffice
            </Link>

            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2 px-2">
              Navigation
            </p>
            <ul className="space-y-1">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2.5 transition-colors"
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mt-6 mb-2 px-2">
              Compte
            </p>
            <ul className="space-y-1">
              <li>
                <SignOutButton>
                  <div className="cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2.5 transition-colors">
                    Déconnexion
                  </div>
                </SignOutButton>
              </li>
              <li>
                <Link
                  className="block text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg px-2 py-2.5 transition-colors"
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                >
                  Retour au site
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="max-w-screen-xl mx-auto p-4 md:p-6 overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
