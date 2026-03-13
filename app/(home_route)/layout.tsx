// Importer les dépendances nécessaires
import React, { ReactNode } from "react";
import NavBar from "@components/navbar";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto xl:p-0 p-4">
      <NavBar /> {/* Composant de la barre de navigation (menu) */}
      {children}
      {/* Contenu de la page principale (passé en tant que composant enfant) */}
      <Footer /> {/* Composant du pied de page (footer) */}
    </div>
  );
}
