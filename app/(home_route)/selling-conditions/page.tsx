// Importer les dépendances nécessaires
import React from "react";

export default function SellingConditions() {
  return (
    <div className="bg-gray-300 text-black p-4 mt-5 rounded-lg text-justify">
      <h1 className="text-lg mb-2">Conditions de vente de bijoux</h1>

      <p className="text-sm">
        Ce sont les conditions de vente qui s'appliquent à toutes les ventes de
        bijoux effectuées via notre site Web. En passant une commande, vous
        acceptez d'être lié par ces conditions.
      </p>

      <h2 className="text-lg mb-2 mt-6">Formation du contrat</h2>

      <p className="text-sm">
        Un contrat entre vous et nous sera formé lorsque nous vous enverrons un
        e-mail de confirmation de commande. Nous nous réservons le droit de
        refuser une commande pour quelque raison que ce soit, y compris, mais
        sans s'y limiter :
      </p>

      <ul className="text-sm mt-4 space-y-2">
        <li className="ml-4 list-disc">
          L'article de bijoux n'est pas en stock.
        </li>
        <li className="ml-4 list-disc">
          Les informations de paiement ne sont pas valides.
        </li>
        <li className="ml-4 list-disc">
          Il y a une transaction frauduleuse présumée.
        </li>
      </ul>

      <h2 className="text-lg mb-2 mt-6">Paiement</h2>

      <p className="text-sm">
        Nous acceptons toutes les principales cartes de crédit. Le paiement doit
        être effectué intégralement avant l'expédition de votre commande de
        bijoux.
      </p>

      <h2 className="text-lg mb-2 mt-6">Livraison</h2>

      <p className="text-sm">
        Nous offrons la livraison gratuite pour toutes les commandes de bijoux
        de plus de 120 € . Les commandes de moins de 120 € seront facturées des
        frais de livraison fixes de 5 €. Les commandes de bijoux sont
        généralement expédiées dans un délai de 1 à 2 jours ouvrables.
      </p>

      <h2 className="text-lg mb-2 mt-6">Retours</h2>

      <p className="text-sm">
        Nous offrons une politique de retour de 30 jours sur tous les articles
        de bijoux. Si vous n'êtes pas satisfait de votre achat pour quelque
        raison que ce soit, vous pouvez le retourner pour un remboursement
        intégral moins le montant de la livraison. L'article de bijoux doit être
        retourné dans son emballage d'origine et dans un état neuf.
      </p>

      <h2 className="text-lg mb-2 mt-6">Assurance des bijoux</h2>

      <p className="text-sm">
        Tous les articles de bijoux achetés sur notre site Web sont assurés
        pendant le transport. Si votre article de bijoux est perdu ou endommagé
        pendant la livraison, nous le remplacerons ou vous rembourserons le prix
        d'achat.
      </p>
    </div>
  );
}
