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
  "Prix soldé",
  "Quantité",
  "Catégorie",
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

  const totalProducts = products.length;

  return (
    <div className="py-5">
      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h5 className="text-xl font-semibold text-slate-800">Produits</h5>
        </div>
        <div className="flex w-full shrink-0 gap-2 md:w-max">
          <SearchForm submitTo="/products/search?query=" />
          <Link
            href="/products/create"
            className="select-none font-bold text-center uppercase transition-all text-xs py-2 px-4 rounded-lg bg-slate-900 text-white shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" />
            <span>Ajouter</span>
          </Link>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full min-w-max table-auto text-left bg-white rounded-xl overflow-hidden">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-slate-100 bg-slate-100 p-4"
                >
                  <span className="text-sm text-slate-600 font-normal leading-none opacity-70">
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
                : "p-4 border-b border-slate-50";

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
                        <span className="text-sm text-slate-800 font-bold">
                          {truncate(title, 30)}
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-slate-800 font-normal">
                      {formatPrice(price.mrp)}
                    </span>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-slate-800 font-normal">
                      {formatPrice(price.salePrice)}
                    </span>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-slate-800">{quantity}</span>
                  </td>
                  <td className={classes}>
                    <span className="text-sm text-slate-800">{category}</span>
                  </td>
                  <td className={classes}>
                    <Link href={`/products/update/${id}`}>
                      <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-50">
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((item) => {
          const { id, thumbnail, title, price, quantity, category } = item;
          return (
            <div
              key={id}
              className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3"
            >
              <Image
                src={thumbnail}
                alt={title}
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/${title}/${id}`}>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {title}
                  </p>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(price.mrp)}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPrice(price.salePrice)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">Qté: {quantity}</span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {category}
                  </span>
                </div>
              </div>
              <Link href={`/products/update/${id}`} className="flex-shrink-0">
                <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
                  <PencilIcon className="h-4 w-4" />
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      {showPageNavigator ? (
        <div className="flex flex-col items-center justify-center border-t border-slate-100 p-4 mt-4">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPageNo === 1}
              onClick={handleOnPrevPress}
              className="px-4 py-2 text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium uppercase disabled:opacity-50"
            >
              Précédente
            </button>
            <button
              disabled={!hasMore}
              onClick={handleOnNextPress}
              className="px-4 py-2 text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium uppercase disabled:opacity-50"
            >
              Suivante
            </button>
          </div>
          <div className="mt-4">
            <span className="text-sm text-slate-800">
              Total : {totalProducts}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
