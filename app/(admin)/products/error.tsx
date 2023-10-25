"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Enregistrer l'erreur dans un service de rapport d'erreurs
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="mt-4 mb-4">{"Une erreur s'est produite !"}</h2>
      <h2>
        Raison : <span className="text-red-400">{error.message}</span>
      </h2>
      <button
        onClick={() => reset()} // Tenter de récupérer en réessayant de rendre le segment
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Réessayer
      </button>
    </div>
  );
}
