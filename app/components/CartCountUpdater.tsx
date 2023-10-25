"use client";
// Importation des dépendances nécessaires
import { IconButton } from "@material-tailwind/react";
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
      <IconButton disabled={disabled} onClick={onDecrement} variant="text">
        <MinusSmallIcon className="w-4 h-4" /> {/* Icône de réduction */}
      </IconButton>

      <span className="text-lg font-medium">{value}</span>
      {/* Affichage de la valeur actuelle */}
      <IconButton disabled={disabled} onClick={onIncrement} variant="text">
        <PlusSmallIcon className="w-4 h-4" /> {/* Icône d'augmentation */}
      </IconButton>
    </div>
  );
};

export default CartCountUpdater;
