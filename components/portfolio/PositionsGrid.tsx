"use client";

import { usePositions } from "@/hooks/portfolio/usePositions";

export default function PositionsGrid() {
  const { data, loading, error } = usePositions();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="text-left p-2">Symbol</th>
          <th className="text-right p-2">Qty</th>
          <th className="text-right p-2">LTP</th>
          <th className="text-right p-2">P&L</th>
          <th className="text-right p-2">Day P&L</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.symbol}>
            <td className="p-2">{row.symbol}</td>
            <td className="text-right p-2">{row.quantity}</td>
            <td className="text-right p-2">
              ?{row.lastPrice.toFixed(2)}
            </td>
            <td className="text-right p-2">
              ?{row.unrealizedPnL.toLocaleString()}
            </td>
            <td className="text-right p-2">
              ?{row.dayPnL.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

