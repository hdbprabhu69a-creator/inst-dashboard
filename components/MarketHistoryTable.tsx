"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function MarketHistoryTable() {

  const { selectedStock } =
    useSelectedStock();

  const [history, setHistory] =
    useState<any[]>([]);

  useEffect(() => {

    async function loadHistory() {

      if (!selectedStock) return;

      const universeSnapshot =
        await getDocs(
          collection(
            db,
            "universe"
          )
        );

      const stockDoc =
        universeSnapshot.docs.find(
          (doc) =>
            doc.data().symbol ===
            selectedStock
        );

      if (!stockDoc) return;

      const historySnapshot =
        await getDocs(

          query(

            collection(
              db,
              "universe",
              stockDoc.id,
              "history"
            ),

            orderBy(
              "date",
              "desc"
            )

          )

        );

      const rows =
        historySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setHistory(rows);

    }

    loadHistory();

  }, [selectedStock]);

  return (

    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4">

      <h2 className="text-cyan-400 text-xl font-bold mb-4">
        MARKET HISTORY
      </h2>

      <div className="max-h-[350px] overflow-y-auto">

        <table className="w-full text-sm">

          <thead className="sticky top-0 bg-zinc-900 z-10">

            <tr className="border-b border-zinc-800 text-zinc-500">

              <th className="text-left p-2">
                Date
              </th>

              <th className="text-left p-2">
                Open
              </th>

              <th className="text-left p-2">
                High
              </th>

              <th className="text-left p-2">
                Low
              </th>

              <th className="text-left p-2">
                Close
              </th>

              <th className="text-left p-2">
                Volume
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map(
              (row: any) => (

                <tr
                  key={row.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800"
                >

                  <td className="p-2">
                    {row.date}
                  </td>

                  <td className="p-2">
                    {row.open}
                  </td>

                  <td className="p-2 text-green-400">
                    {row.high}
                  </td>

                  <td className="p-2 text-red-400">
                    {row.low}
                  </td>

                  <td className="p-2">
                    {row.close}
                  </td>

                  <td className="p-2">
                    {row.volume}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}