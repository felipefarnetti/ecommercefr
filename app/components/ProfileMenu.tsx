import {
  ChevronDownIcon,
  PowerIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { MenuItems } from "@app/types";
import SignOutButton from "./SignOutButton";

interface Props {
  menuItems: MenuItems[];
  avatar?: string;
}

export default function ProfileMenu({ menuItems, avatar }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setIsMenuOpen(false);
  const { isAdmin, profile } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto text-blue-gray-900 hover:bg-blue-gray-50"
      >
        <Image
          src={avatar || "/avatar.png"}
          alt="avatar"
          width={36}
          height={36}
          className="w-9 h-9 rounded-full border border-blue-700 p-0.5 object-cover"
        />
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`h-3 w-3 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50">
          {menuItems.map(({ href, icon, label }) => {
            return (
              <Link key={href} href={href} className="outline-none">
                <button
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded w-full px-3 py-2 text-sm hover:bg-blue-gray-50 text-left"
                >
                  {icon}
                  <span>{label}</span>
                </button>
              </Link>
            );
          })}

          {isAdmin ? (
            <Link href="/dashboard" className="outline-none">
              <button
                onClick={closeMenu}
                className="flex items-center gap-2 rounded w-full px-3 py-2 text-sm hover:bg-blue-gray-50 text-left"
              >
                <RectangleGroupIcon className="h-4 w-4" />
                <span>Backoffice</span>
              </button>
            </Link>
          ) : null}

          <div className="px-3 py-2 text-sm hover:bg-blue-gray-50 rounded">
            <SignOutButton>
              <p className="flex items-center gap-2 rounded">
                <PowerIcon className="h-4 w-4" />
                <span>Se déconnecter</span>
              </p>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}
