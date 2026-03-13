// Importation des dépendances nécessaires
import React, { FC, FormEventHandler, ReactNode } from "react";

// Interface pour les propriétés (props) du composant
interface Props {
  title: string;
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

// Composant pour le conteneur du formulaire d'authentification
const AuthFormContainer: FC<Props> = ({ title, children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-96 p-6 space-y-6 bg-white shadow-md rounded-md"
    >
      <h3 className="text-center font-semibold">{title}</h3>
      {children}
    </form>
  );
};

export default AuthFormContainer;
