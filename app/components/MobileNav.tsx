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
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-2 flex items-center justify-between p-4 z-50 ml-2">
          <h5 className="text-xl font-semibold text-blue-gray-800">
            Ma Boutique
          </h5>
          <button
            className="p-2 rounded-lg text-blue-gray-600 hover:bg-blue-gray-50"
            onClick={onClose}
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-col gap-1 p-2">
          {menuItems.map(({ href, icon, label }) => {
            return (
              <Link key={href} href={href}>
                <li
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer text-sm"
                >
                  {icon}
                  {label}
                </li>
              </Link>
            );
          })}

          {isAdmin ? (
            <Link href="/dashboard">
              <li
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer text-sm"
              >
                <RectangleGroupIcon className="h-4 w-4" />
                BackOffice
              </li>
            </Link>
          ) : null}

          {loggedIn ? (
            <SignOutButton>
              <li className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-gray-50 cursor-pointer text-sm">
                <PowerIcon className="h-5 w-5" />
                Se Déconnecter
              </li>
            </SignOutButton>
          ) : (
            <div className="flex items-center">
              <Link
                className="px-4 py-1 flex-1 text-center"
                href="/auth/signin"
              >
                Se connecter
              </Link>
              <Link
                className="bg-blue-500 text-white px-4 py-1 rounded flex-1 text-center"
                href="/auth/signup"
              >
                {"S'inscrire"}
              </Link>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}
