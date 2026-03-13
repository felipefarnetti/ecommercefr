"use client";
// Importation des dépendances nécessaires
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  id?: string;
  verified?: boolean;
}

export default function EmailVerificationBanner({ id, verified }: Props) {
  const [submitting, setSubmitting] = useState(false);

  // Fonction pour demander une nouvelle vérification d'email
  const applyForReverification = async () => {
    if (!id) return; // Si l'identifiant n'est pas défini, ne rien faire
    setSubmitting(true); // Marque l'interface comme occupée

    // Appel à l'API pour demander une nouvelle vérification
    const res = await fetch("/api/users/verify?userId=" + id, {
      method: "GET",
    });
    const { message, error } = await res.json();

    if (!res.ok && error) {
      toast.error(error); // Affiche une notification d'erreur en cas de problème
    }
    toast.success(message); // Affiche une notification de succès
    setSubmitting(false); // Marque l'interface comme disponible
  };

  if (verified) return null; // Si l'email est vérifié, ne rien afficher

  return (
    <div className="p-3 text-center bg-amber-50 border border-amber-200 rounded-lg">
      <span className="text-amber-800">
        {"Il semblerait que vous n'ayez pas encore vérifié votre email."}
      </span>

      <button
        disabled={submitting}
        onClick={applyForReverification}
        className="ml-2 text-amber-600 font-semibold underline disabled:opacity-50"
      >
        {submitting
          ? "Génération du lien..."
          : "Obtenir le lien de vérification."}
      </button>
    </div>
  );
}
