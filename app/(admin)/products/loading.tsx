// Importe la bibliothèque React
import React from "react";

// Définit un tableau des en-têtes de tableau
const TABLE_HEAD = [
  "Produit",
  "Prix de vente conseillé",
  "Prix de vente",
  "Quantité",
  "Catégorie",
  "Modifier",
];

// Crée un composant React qui charge les produits
export default function ProductsLoading() {
  // Crée un tableau de produits fictifs
  const dummyProducts = Array(10).fill("");

  // Retourne une disposition avec un message d'attente et un tableau de produits
  return (
    <div className="py-5 animate-pulse">
      <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="w-36 h-10 bg-gray-300" />
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <div className="w-96 h-10 bg-gray-300" />
        </div>
      </div>
      <div>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                // Commentaire : Affiche l'en-tête du tableau
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <p className="text-blue-gray-500 font-normal leading-none opacity-70">
                    {head}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dummyProducts.map((_, index) => {
              // Commentaire : Affiche une ligne de tableau vide pour chaque produit fictif
              const isLast = index === dummyProducts.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="w-20 aspect-square rounded-full bg-gray-300" />
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-20 h-4 bg-gray-300" />
                  </td>
                  <td className={classes}>
                    <div className="w-20 h-4 bg-gray-300" />
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <div className="w-20 h-4 bg-gray-300" />
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <div className="w-20 h-4 bg-gray-300" />
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-2 h-4 bg-gray-300" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
