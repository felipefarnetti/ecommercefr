"use client";
// Importation des dépendances nécessaires
import { SessionProvider } from "next-auth/react";
import React, { FC, ReactNode } from "react";

// Interface pour les propriétés (props) du composant
interface Props {
  children: ReactNode;
}

// Composant pour la gestion de la session d'authentification
const AuthSession: FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthSession;
