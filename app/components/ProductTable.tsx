"use client";

import { PencilIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import truncate from "truncate";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchForm from "@components/SearchForm";

export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  price: {
    mrp: number;
    salePrice: number;
    saleOff: number;
  };
  category: string;
  quantity: number;
}

const formatPrice = (amount: number) => {
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return formatter.format(amount);
};

const TABLE_HEAD = [
  "Produit",
  "Prix",
  "Pix soldé",
  "Quantité",
  "Categorie",
  "Modifier",
];

interface Props {
  products: Product[];
  currentPageNo: number;
  hasMore?: boolean;
  showPageNavigator?: boolean;
}

export default function ProductTable(props: Props) {
  const router = useRouter();
  const {
    products = [],
    currentPageNo,
    hasMore,
    showPageNavigator = true,
  } = props;

  const handleOnPrevPress = () => {
    const prevPage = currentPageNo - 1;
    if (prevPage > 0) router.push(`/products?page=${prevPage}`);
  };

  const handleOnNextPress = () => {
    const nextPage = currentPageNo + 1;
    router.push(`/products?page=${nextPage}`);
  };

  // Calculate the total number of products
  const totalProducts = products.length;

  return (
    <div className="py-5">
      <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h5 className="text-xl font-semibold text-blue-gray-800">
            Produits
          </h5>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <SearchForm submitTo="/products/search$query=" />
          <Link
            href="/products/create"
            className="select-none font-bold text-center uppercase transition-all text-xs py-2 px-4 rounded-lg bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" />{" "}
            <span>Ajouter</span>
          </Link>
        </div>
      </div>
      <div className="px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <span className="text-sm text-blue-gray-600 font-normal leading-none opacity-70">
                    {head}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => {
              const { id, thumbnail, title, price, quantity, category } = item;
              const isLast = index === products.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Image
                        src={thumbnail}
                        alt={title}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <Link href={`/${title}/${id}`}>
                        <span className="text-sm text-blue-gray-800 font-bold">
                          {truncate(title, 30)}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-blue-gray-800 font-normal">
                      {formatPrice(price.mrp)}
                    </span>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-blue-gray-800 font-normal">
                      {formatPrice(price.salePrice)}
                    </span>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <span className="text-sm text-blue-gray-800">
                        {quantity}
                      </span>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <span className="text-sm text-blue-gray-800">
                        {category}
                      </span>
                    </div>
                  </td>
                  <td className={classes}>
                    <Link href={`/products/update/${id}`}>
                      <button className="p-2 rounded-lg text-blue-gray-600 hover:bg-blue-gray-50">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showPageNavigator ? (
        <div className="flex flex-col items-center justify-center border-t border-blue-gray-50 p-4">
          {/* Previous and Next buttons */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentPageNo === 1}
              onClick={handleOnPrevPress}
              className="px-4 py-2 text-blue-gray-900 hover:bg-blue-gray-50 rounded-lg text-sm font-medium uppercase disabled:opacity-50"
            >
              Précédente
            </button>
            <button
              disabled={!hasMore}
              onClick={handleOnNextPress}
              className="px-4 py-2 text-blue-gray-900 hover:bg-blue-gray-50 rounded-lg text-sm font-medium uppercase disabled:opacity-50"
            >
              Suivante
            </button>
          </div>
          {/* Total number of products (moved below the buttons) */}
          <div className="mt-4">
            <span className="text-sm text-blue-gray-800">
              Total : {totalProducts}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
