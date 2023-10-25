// Importation des dépendances nécessaires
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";

import NavBar from "@components/navbar";

// Définition des types de propriétés
interface Props {
  children: ReactNode;
}

// Composant de la mise en page privée
export default async function PrivateLayout({ children }: Props) {
  // Vérifie si l'utilisateur est authentifié
  const session = await auth();
  if (!session) return redirect("/auth/signin");

  // console.log(session.user);
  // session.user.verified;

  // Rendu de la mise en page privée avec la barre de navigation et les enfants (contenu)
  return (
    <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
      <NavBar />
      {children}
    </div>
  );
}
