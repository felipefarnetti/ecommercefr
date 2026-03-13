// Importer les dépendances nécessaires
import React, { FC, ReactNode } from "react";

// Interface définissant les propriétés attendues
interface Props {
  children: ReactNode;
}

// Composant de mise en page utilisé pour les pages d'authentification
const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
};

export default AuthLayout;
