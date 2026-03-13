"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import ProfileMenu from "../ProfileMenu";
import { MobileNav } from "../MobileNav";
import CartIcon from "../CarIcon";
import useAuth from "@hooks/useAuth";
import SearchForm from "../SearchForm";

interface Props {
  cartItemsCount: number;
  avatar?: string;
}

export const menuItems = [
  {
    href: "/profile",
    icon: <UserCircleIcon className="h-4 w-4" />,
    label: "Mon profil",
  },
  {
    href: "/profile/orders",
    icon: <ShoppingBagIcon className="h-4 w-4" />,
    label: "Mes commandes",
  },
  {
    href: "/profile/wishlist",
    icon: <HeartIcon className="h-4 w-4" />,
    label: "Liste d'envies",
  },
];

export default function NavUI({ cartItemsCount, avatar }: Props) {
  const [open, setOpen] = useState(false);
  const { loading, loggedIn } = useAuth();

  useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-screen-xl px-4 py-4 md:py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-amber-600 transition-colors"
          >
            Ma Boutique
          </Link>

          <div className="flex-1 flex justify-center mx-4">
            <div className="md:w-96 w-full">
              <SearchForm submitTo="/search?query=" />
            </div>
          </div>

          <div className="hidden lg:flex gap-3 items-center">
            <CartIcon cartItems={cartItemsCount} />
            {loggedIn ? (
              <ProfileMenu menuItems={menuItems} avatar={avatar} />
            ) : loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                  href="/auth/signin"
                >
                  Se connecter
                </Link>
                <Link
                  className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                  href="/auth/signup"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <CartIcon cartItems={cartItemsCount} />
            <button
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
              ) : (
                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="lg:hidden">
        <MobileNav
          menuItems={menuItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </div>
    </>
  );
}
