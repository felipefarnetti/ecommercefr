"use client";
// Importation des dépendances nécessaires
import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import categories from "@utils/categories";
import Link from "next/link";

export default function CategoryMenu() {
  return (
    <HorizontalMenu>
      {categories.map((c) => (
        // Utilisation de la fonction de mapping pour afficher chaque catégorie
        <Link key={c} href={`/browse-products/${c}`}>
          {/* Création d'un lien vers la page de catégorie */}
          <span
            className="inline-block mr-2 border border-teal-500 text-teal-500 rounded-full px-3 py-1"
            style={{
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            {c}
          </span>
        </Link>
      ))}
    </HorizontalMenu>
  );
}
