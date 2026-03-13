"use client";

// Importer les dépendances nécessaires
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Contact() {
  // Définir les données du formulaire initiales
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Obtenir le routeur pour la navigation
  const router = useRouter();

  // Fonction pour gérer la soumission du formulaire
  async function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      // Envoyer une requête POST à l'endpoint "/api/contact" avec les données du formulaire
      const response = await fetch("/api/contact", {
        method: "post",
        body: formData,
      });

      if (!response.ok) {
        console.log("Échec de la requête");
        throw new Error(`Statut de la réponse : ${response.status}`);
      }

      // Analyser les données de la réponse
      const responseData = await response.json();
      console.log(responseData["message"]);

      // Afficher un message de succès
      alert("Message envoyé avec succès");
    } catch (err) {
      console.error(err);

      // Afficher un message d'erreur
      alert("Erreur, veuillez essayer de soumettre à nouveau le formulaire");
    }
  }

  // Fonction pour effacer les données du formulaire et actualiser la page
  function clearForm() {
    setFormData({
      name: "",
      email: "",
      message: "",
    });

    // Rediriger vers la page actuelle pour effacer l'état du formulaire
    router.refresh();
  }

  return (
    <main className="flex h-auto flex-col items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="mt-10 mb-2 w-80 max-w-screen-lg md:w-96 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <h2 className="text-center text-lg font-semibold text-slate-900 mb-6">
          Formulaire de contact
        </h2>

        <div className="mb-6 flex flex-col gap-4">
          <div>
            <label htmlFor="form-name" className="block text-sm font-medium text-slate-700 mb-1">Nom :</label>
            <input
              id="form-name"
              autoComplete="name"
              maxLength={50}
              size={50}
              name="name"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-slate-400 transition"
            />
          </div>

          <div>
            <label htmlFor="form-email" className="block text-sm font-medium text-slate-700 mb-1">Email :</label>
            <input
              id="form-email"
              required
              autoComplete="email"
              maxLength={80}
              name="email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-slate-400 transition"
            />
          </div>

          <div>
            <label htmlFor="form-message" className="block text-sm font-medium text-slate-700 mb-1">Message :</label>
            <textarea
              id="form-message"
              required
              name="message"
              rows={5}
              value={formData.message}
              onChange={(event) =>
                setFormData({ ...formData, message: event.target.value })
              }
              className="w-full text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-slate-400 transition resize-none"
            />
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <button
            className="flex-1 rounded-lg bg-slate-900 text-white h-10 font-medium hover:bg-slate-800 transition-colors"
            type="submit"
          >
            Envoyer
          </button>
          <button
            className="flex-1 rounded-lg bg-slate-100 text-slate-700 h-10 font-medium hover:bg-slate-200 transition-colors"
            type="button"
            onClick={clearForm}
          >
            Effacer
          </button>
        </div>
      </form>

      <div className="mt-4 mb-10">
        <Link href="/" className="inline-block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Accueil
        </Link>
      </div>
    </main>
  );
}
