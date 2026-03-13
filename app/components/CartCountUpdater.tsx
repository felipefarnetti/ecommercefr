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
      className="flex items-center border border-slate-200 rounded-lg"
    >
      <button
        disabled={disabled}
        onClick={onDecrement}
        className="p-2 rounded-l-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        <MinusSmallIcon className="w-4 h-4" />
      </button>

      <span className="text-sm font-semibold text-slate-900 px-3 min-w-[2rem] text-center">{value}</span>

      <button
        disabled={disabled}
        onClick={onIncrement}
        className="p-2 rounded-r-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
      >
        <PlusSmallIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartCountUpdater;
