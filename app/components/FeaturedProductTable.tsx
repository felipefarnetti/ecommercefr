"use client";
import Link from "next/link";
import React, { useTransition } from "react";
import truncate from "truncate";
import { deleteFeaturedProduct } from "@app/(admin)/products/featured/action";
import { useRouter } from "next/navigation";

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

  const handleDelete = async (id: string) => {
    await deleteFeaturedProduct(id);
    router.refresh();
  };

  return (
    <div className="py-5">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full min-w-max table-auto text-left bg-white rounded-xl overflow-hidden">
          <thead>
            <tr>
              {["Détail", "Produit", "Actions"].map((head, index) => (
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
                    <span className="text-sm text-slate-800 font-bold">
                      {truncate(title, 100)}
                    </span>
                  </td>
                  <td className={classes}>
                    <Link href={link}>
                      <span className="text-sm text-slate-800 font-bold hover:underline">
                        Voir le produit
                      </span>
                    </Link>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
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
                        className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-medium uppercase disabled:opacity-50"
                      >
                        {isPending ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
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
          const { id, link, title } = item;
          return (
            <div
              key={id}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
            >
              <p className="text-sm font-bold text-slate-800">{title}</p>
              <div className="flex items-center justify-between">
                <Link
                  href={link}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Voir le produit
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    className="text-xs font-semibold text-slate-600 hover:underline uppercase"
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
                    className="text-xs text-red-500 font-medium uppercase disabled:opacity-50"
                  >
                    {isPending ? "..." : "Supprimer"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
