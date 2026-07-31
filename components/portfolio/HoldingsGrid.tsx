"use client";

import { useHoldings } from "@/hooks/portfolio/useHoldings";

export default function HoldingsGrid() {
  const { data, loading, error } = useHoldings();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left p-2">Symbol</th>
          <th className="text-right p-2">Qty</th>
          <th className="text-right p-2">Avg</th>
          <th className="text-right p-2">Invested</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.symbol}>
            <td className="p-2">{row.symbol}</td>
            <td className="text-right p-2">{row.quantity}</td>
            <td className="text-right p-2">
              ?{row.averagePrice.toFixed(2)}
            </td>
            <td className="text-right p-2">
              ?{row.investedValue.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

