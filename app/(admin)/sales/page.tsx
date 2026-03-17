import OrderModel from "@models/orderModel";
import React from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import SalesChart from "@components/SalesChart";
import { formatPrice } from "@utils/helper";
import startDb from "@lib/db";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const sevenDaysSalesHistory = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dateList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateString = format(date, "yyyy-MM-dd");
    dateList.push(dateString);
  }

  await startDb();

  const last7DaysSales: { _id: string; totalAmount: number; count: number }[] =
    await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          paymentStatus: "payé",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

  const sales = dateList.map((date) => {
    const matchedSale = last7DaysSales.find((sale) => sale._id === date);
    return {
      day: format(parseISO(date), "EEE dd", { locale: fr }),
      sale: matchedSale ? matchedSale.totalAmount : 0,
      orders: matchedSale ? matchedSale.count : 0,
    };
  });

  const totalSales = last7DaysSales.reduce(
    (prev, { totalAmount }) => prev + totalAmount,
    0
  );
  const totalOrders = last7DaysSales.reduce(
    (prev, { count }) => prev + count,
    0
  );

  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const bestDay = sales.reduce(
    (best, current) => (current.sale > best.sale ? current : best),
    sales[0]
  );

  return { sales, totalSales, totalOrders, avgOrderValue, bestDay };
};

export default async function Sales() {
  const salesData = await sevenDaysSalesHistory();

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(salesData.totalSales),
      subtitle: "7 derniers jours",
      icon: CurrencyDollarIcon,
      color: "bg-emerald-500",
    },
    {
      label: "Commandes",
      value: salesData.totalOrders.toString(),
      subtitle: "7 derniers jours",
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
    },
    {
      label: "Panier moyen",
      value: formatPrice(salesData.avgOrderValue),
      subtitle: "par commande",
      icon: ArrowTrendingUpIcon,
      color: "bg-amber-500",
    },
    {
      label: "Meilleur jour",
      value: salesData.bestDay?.day || "—",
      subtitle: salesData.bestDay ? formatPrice(salesData.bestDay.sale) : "—",
      icon: CalendarDaysIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold text-slate-900">
        Tableau des ventes
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`${kpi.color} p-2 rounded-lg`}
              >
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm text-slate-500 font-medium">
                {kpi.label}
              </span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-slate-900">
              {kpi.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{kpi.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">
          Évolution des ventes (7 jours)
        </h2>
        <SalesChart data={salesData.sales} />
      </div>
    </div>
  );
}
