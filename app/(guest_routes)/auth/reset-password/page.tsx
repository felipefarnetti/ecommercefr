// Importer les dépendances nécessaires
import UpdatePassword from "@components/UpdatePassword";
import startDb from "@lib/db";
import PasswordResetToken from "@models/passwordResetToken";
import { redirect } from "next/navigation";
import React from "react";

// Interface définissant les propriétés attendues
interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

// Fonction asynchrone pour valider le jeton de réinitialisation de mot de passe
const fetchTokenValidation = async (token: string, userId: string) => {
  // Initialisation de la base de données
  await startDb();

  // Recherche du jeton de réinitialisation de mot de passe associé à l'utilisateur
  const resetToken = await PasswordResetToken.findOne({ user: userId });
  if (!resetToken) return null;

  // Comparaison du jeton reçu avec le jeton enregistré
  const matched = await resetToken.compareToken(token);
  if (!matched) return null;

  return true;
};

export default async function ResetPassword({ searchParams }: Props) {
  const { token, userId } = searchParams;

  // Si les paramètres nécessaires ne sont pas fournis, rediriger vers la page d'erreur 404
  if (!token || !userId) return redirect("/404");

  // Valider le jeton de réinitialisation de mot de passe
  const isValid = await fetchTokenValidation(token, userId);

  // Si le jeton n'est pas valide, rediriger vers la page d'erreur 404
  if (!isValid) return redirect("/404");

  // Afficher le composant de réinitialisation de mot de passe
  return <UpdatePassword token={token} userId={userId} />;
}
