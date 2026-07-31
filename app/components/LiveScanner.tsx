"use client";

import { useEffect, useState } from "react";
import { scannerStore } from "@/lib/data/scannerStore";

export default function LiveScanner() {

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {

    scannerStore.subscribe((all: any[]) => {
      setData([...all]);
    });

  }, []);

  function getColor(action?: string) {
    if (action === "BUY") return "text-green-500";
    if (action === "SELL") return "text-red-500";
    return "text-yellow-500";
  }

  return (
    <div className="p-4 text-xs font-mono bg-black text-white h-screen overflow-auto">

      <h1 className="text-lg mb-4 text-blue-400">
        📊 LIVE INSTITUTIONAL SCANNER (99 STOCKS)
      </h1>

      <table className="w-full border-collapse">

        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th>SYMBOL</th>
            <th>PATTERN</th>
            <th>ACTION</th>
            <th>CONF</th>
            <th>STATE</th>
          </tr>
        </thead>

        <tbody>

          {data.map((item, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-900">

              <td className="p-2 text-blue-300">{item.symbol}</td>

              <td className="p-2">{item.pattern}</td>

              <td className={`p-2 ${getColor(item.prediction?.direction)}`}>
                {item.prediction?.direction || "WAIT"}
              </td>

              <td className="p-2">
                {item.confidence?.toFixed?.(2) || 0}
              </td>

              <td className="p-2 text-gray-400">
                {item.prediction?.failureRisk ? "ACTIVE" : "IDLE"}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );

}

