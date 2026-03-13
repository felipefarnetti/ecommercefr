import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              className="text-sm hover:text-white transition-colors"
              href="/contact"
            >
              Nous contacter
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              className="text-sm hover:text-white transition-colors"
              href="/selling-conditions"
            >
              Conditions de vente
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 mr-1">Paiement sécurisé</span>
            <FontAwesomeIcon
              className="h-8 w-auto text-slate-400 hover:text-white transition-colors"
              icon={faCcVisa}
            />
            <FontAwesomeIcon
              className="h-8 w-auto text-slate-400 hover:text-white transition-colors"
              icon={faCcMastercard}
            />
            <FontAwesomeIcon
              className="h-8 w-auto text-slate-400 hover:text-white transition-colors"
              icon={faCcAmex}
            />
          </div>

          <p className="text-xs text-slate-500">
            Expédition sous 48 heures
          </p>
        </div>
      </div>
    </footer>
  );
}
