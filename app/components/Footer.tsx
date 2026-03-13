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
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Ma Boutique</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Votre boutique en ligne de confiance. Qualité, rapidité et service client à votre écoute.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Informations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-sm hover:text-white transition-colors" href="/contact">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-white transition-colors" href="/selling-conditions">
                  Conditions de vente
                </Link>
              </li>
              <li>
                <Link className="text-sm hover:text-white transition-colors" href="/refund-policy">
                  Politique de retour
                </Link>
              </li>
            </ul>
          </div>

          {/* Reassurance */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Nos garanties
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-amber-500">&#10003;</span>
                Expédition sous 48 heures
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">&#10003;</span>
                Retour gratuit sous 14 jours
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">&#10003;</span>
                Service client réactif
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Ma Boutique. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 mr-1">Paiement sécurisé</span>
            <FontAwesomeIcon
              className="h-7 w-auto text-slate-500 hover:text-white transition-colors"
              icon={faCcVisa}
            />
            <FontAwesomeIcon
              className="h-7 w-auto text-slate-500 hover:text-white transition-colors"
              icon={faCcMastercard}
            />
            <FontAwesomeIcon
              className="h-7 w-auto text-slate-500 hover:text-white transition-colors"
              icon={faCcAmex}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
