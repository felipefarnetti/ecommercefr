// Importation des dépendances nécessaires
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="bg-gradient-to-r from-blue-300 to-pink-100 text-black p-4 mt-5 rounded-lg">
      <div className="container mx-auto text-center">
        <p className="text-sm" style={{ marginBottom: 7 }}></p>
        <p className="text-sm" style={{ marginBottom: 5, marginTop: 5 }}>
          <Link className="text-sm md:text-lg mr-2" href="/contact">
            Nous contacter
          </Link>
          |
          <Link className="text-sm md:text-lg ml-2" href="/selling-conditions">
            Conditions de vente
          </Link>
        </p>
        <p className="text-sm mb-2">
          <span className="flex items-center justify-center mb-2">
            Cartes de crédit acceptées :
            <FontAwesomeIcon
              className="h-10 md:h-12 w-auto ml-4 text-green-700"
              icon={faCcVisa}
            />
            <FontAwesomeIcon
              className="h-10 md:h-12 w-auto ml-4 text-red-600"
              icon={faCcMastercard}
            />
            <FontAwesomeIcon
              className="h-10 md:h-12 w-auto ml-4 text-blue-600"
              icon={faCcAmex}
            />
          </span>
        </p>
        <p>Expédition sous 48 heures</p>
      </div>
    </div>
  );
}
