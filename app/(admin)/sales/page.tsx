// Importer les dépendances nécessaires
import OrderModel from "@models/orderModel";
import React from "react";
// import dateFormat from "dateformat"; *Pour anglais
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import SalesChart from "@components/SalesChart";
import GridView from "@components/GridView";
import { formatPrice } from "@utils/helper";
import startDb from "@lib/db";

// Obtenir l'historique des ventes des 7 derniers jours
const sevenDaysSalesHistory = async () => {
  // Calculer la date d'il y a 7 jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Créer une liste de dates des 7 derniers jours
  const dateList: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    const dateString = format(date, "yyyy-MM-dd");
    dateList.push(dateString);
  }

  // Connecter à la base de données
  await startDb();

  // Obtenir les ventes des 7 derniers jours depuis la base de données
  const last7DaysSales: { _id: string; totalAmount: number }[] =
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
        },
      },
    ]);

  // Comparer les dates et remplir les ventes vides avec 0
  //[{sale: nulber, day:string}] => [{sale : 1000, day: ¨mon¨},{sale:>0, day: ¨thu¨}, ...]
  const sales = dateList.map((date) => {
    const matchedSale = last7DaysSales.find((sale) => sale._id === date);
    return {
      day: format(parseISO(date), "eee", { locale: fr }), // Formater la date en français
      sale: matchedSale ? matchedSale.totalAmount : 0,
    };
  });

  // Calculer le total des ventes des 7 derniers jours
  const totalSales = last7DaysSales.reduce((prevValue, { totalAmount }) => {
    return (prevValue += totalAmount);
  }, 0);

  // Retourner les ventes des 7 derniers jours et le total des ventes
  return { sales, totalSales };
};

// Afficher les ventes des 7 derniers jours
export default async function Sales() {
  // Obtenir les ventes des 7 derniers jours
  const salesData = await sevenDaysSalesHistory();

  // Retourner la vue des ventes des 7 derniers jours
  return (
    <div>
      <GridView>
        <div className="bg-blue-500 p-4 rounded space-y-4">
          <h1 className="font-semibold text-3xl text-white">
            {formatPrice(salesData.totalSales)}
          </h1>

          <div className="text-white">
            <p>Ventes totales</p>
            <p>7 derniers jours</p>
          </div>
        </div>
      </GridView>
      <div className="mt-10">
        <h1 className="font-semibold text-3xl mb-4">
          Historique des ventes des 7 derniers jours
        </h1>
        <SalesChart data={salesData.sales} />
      </div>
    </div>
  );
}
