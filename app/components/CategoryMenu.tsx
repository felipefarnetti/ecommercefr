"use client";
// Importation des dépendances nécessaires
import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import categories from "@utils/categories";
import Link from "next/link";
import { Chip } from "@material-tailwind/react";

export default function CategoryMenu() {
  return (
    <HorizontalMenu>
      {categories.map((c) => (
        // Utilisation de la fonction de mapping pour afficher chaque catégorie
        <Link key={c} href={`/browse-products/${c}`}>
          {/* Création d'un lien vers la page de catégorie */}
          <Chip
            color="teal"
            className="mr-2"
            variant="outlined"
            value={c}
            style={{
              fontSize: "11px",
              fontWeight: "bold",
            }}
          />
        </Link>
      ))}
    </HorizontalMenu>
  );
}
