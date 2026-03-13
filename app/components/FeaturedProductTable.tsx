"use client";
// Importation des dépendances nécessaires
import Link from "next/link";
import React, { useTransition } from "react";
import truncate from "truncate";
import { deleteFeaturedProduct } from "@app/(admin)/products/featured/action";
import { useRouter } from "next/navigation";

const TABLE_HEAD = ["Detail", "Product", ""];

interface Props {
  products: Products[];
}

interface Products {
  id: string;
  banner: string;
  title: string;
  link: string;
  linkTitle: string;
}

export default function FeaturedProductTable({ products }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Fonction pour supprimer un produit en vedette par son ID
  const handleDelete = async (id: string) => {
    await deleteFeaturedProduct(id);
    router.refresh();
  };

  return (
    <div className="py-5">
      <div className="px-0">
        <table className="w-full min-w-max table-auto text-left bg-white rounded-xl overflow-hidden">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
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
              const { id, link, title } = item;
              const isLast = index === products.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-slate-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-800 font-bold">
                        {truncate(title, 100)}
                      </span>
                    </div>
                  </td>
                  <td className={classes}>
                    <Link href={link}>
                      <span className="text-sm text-slate-800 font-bold hover:underline">
                        Voir le produit
                      </span>
                    </Link>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center">
                      <Link
                        className="font-semibold uppercase text-xs text-slate-600 hover:underline"
                        href={`/products/featured/update?id=${id}`}
                      >
                        Modifier
                      </Link>
                      <button
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            await handleDelete(item.id);
                          });
                        }}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium uppercase disabled:opacity-50"
                      >
                        {isPending ? "En train de supprimer" : "Suprimmer"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
