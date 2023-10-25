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
    <main className="flex h-auto flex-col items-center bg-blue-gray-100 rounded-lg">
      <form
        onSubmit={handleSubmit}
        className="mt-10 mb-2 w-96 max-w-screen-lg sm:w-96 bg-gradient-to-r from-blue-100 to-pink-100 border border-gray-400 p-4 rounded-lg"
      >
        <h2 className="text-center text-lg font-semibold underline underline-offset-8 mb-4">
          Formulaire de contact
        </h2>

        <div className="mb-4 flex flex-col w-500">
          <label htmlFor="form-name">Nom :</label>
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
            className="text-black bg-gray-300 rounded-lg p-2 shadow-sm"
          />

          <label htmlFor="form-email"> Email :</label>
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
            className="text-black bg-gray-300 rounded-lg p-2 shadow-sm"
          />

          <label htmlFor="form-message"> Message : </label>
          <textarea
            id="form-message"
            required
            name="message"
            rows={5}
            value={formData.message}
            onChange={(event) =>
              setFormData({ ...formData, message: event.target.value })
            }
            className="text-black bg-gray-300 rounded-lg p-2 shadow-sm"
          />
        </div>
        <div className="flex justify-between">
          <button
            className="rounded-lg bg-sky-400 w-20 h-10 border-black border shadow-md"
            type="submit"
          >
            Envoyer
          </button>
          <button
            className="rounded-lg bg-sky-400 w-20 h-10 border-black border shadow-md"
            type="button"
            onClick={clearForm}
          >
            Effacer
          </button>
        </div>
      </form>

      <div className="relative flex place-items-center mt-4 mb-10 w-20 h-10 justify-center bg-yellow-600 text-black border-black border rounded-lg shadow-md">
        <Link href="/">Accueil</Link>
      </div>
    </main>
  );
}
