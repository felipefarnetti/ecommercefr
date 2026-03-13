import React from "react";
import { XMarkIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { MenuItems } from "@app/types";
import SignOutButton from "./SignOutButton";

interface Props {
  open: boolean;
  onClose(): void;
  menuItems: MenuItems[];
}

export function MobileNav({ open, onClose, menuItems }: Props) {
  const { isAdmin, loggedIn } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h5 className="text-lg font-bold text-slate-900">Ma Boutique</h5>
          <button
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={onClose}
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-col gap-0.5 p-3">
          {menuItems.map(({ href, icon, label }) => (
            <Link key={href} href={href}>
              <li
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
              >
                {icon}
                {label}
              </li>
            </Link>
          ))}

          {isAdmin ? (
            <Link href="/dashboard">
              <li
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <RectangleGroupIcon className="h-4 w-4" />
                BackOffice
              </li>
            </Link>
          ) : null}

          <div className="border-t border-slate-100 my-2" />

          {loggedIn ? (
            <SignOutButton>
              <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm font-medium transition-colors">
                <PowerIcon className="h-4 w-4" />
                Se Déconnecter
              </li>
            </SignOutButton>
          ) : (
            <div className="flex flex-col gap-2 px-3 pt-2">
              <Link
                className="text-center text-sm font-medium text-slate-700 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                href="/auth/signin"
                onClick={onClose}
              >
                Se connecter
              </Link>
              <Link
                className="text-center text-sm font-medium bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
                href="/auth/signup"
                onClick={onClose}
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}
