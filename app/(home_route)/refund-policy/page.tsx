// Importer les dépendances nécessaires
import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-300 text-black p-4 mt-5 rounded-lg text-justify">
      <h2 className="text-lg mb-2">Politique de Retour</h2>

      <p className="text-sm">
        {
          "Nous offrons une politique de retour de 30 jours sur tous les articles de bijouterie. Si vous n'êtes pas satisfait de votre achat pour quelque raison que ce soit, vous pouvez le retourner pour un remboursement complet moins la livraison. L'article de bijouterie doit être retourné dans son emballage d'origine et dans un état neuf."
        }
      </p>
    </div>
  );
}
