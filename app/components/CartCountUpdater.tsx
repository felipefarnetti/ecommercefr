"use client";
// Importation des dépendances nécessaires
import { PlusSmallIcon, MinusSmallIcon } from "@heroicons/react/24/outline";

// Interface pour les propriétés (props) du composant

interface Props {
  value: number;
  onDecrement?(): void;
  onIncrement?(): void;
  disabled?: boolean;
}

// Composant pour mettre à jour la quantité dans le panier

const CartCountUpdater = ({
  onDecrement,
  onIncrement,
  disabled,
  value,
}: Props) => {
  return (
    <div
      style={{ opacity: disabled ? "0.5" : "1" }}
      className="flex items-center space-x-2"
    >
      <button
        disabled={disabled}
        onClick={onDecrement}
        className="p-1 rounded-lg text-blue-gray-900 hover:bg-blue-gray-50 disabled:opacity-50"
      >
        <MinusSmallIcon className="w-4 h-4" /> {/* Icône de réduction */}
      </button>

      <span className="text-lg font-medium">{value}</span>
      {/* Affichage de la valeur actuelle */}
      <button
        disabled={disabled}
        onClick={onIncrement}
        className="p-1 rounded-lg text-blue-gray-900 hover:bg-blue-gray-50 disabled:opacity-50"
      >
        <PlusSmallIcon className="w-4 h-4" /> {/* Icône d'augmentation */}
      </button>
    </div>
  );
};

export default CartCountUpdater;
