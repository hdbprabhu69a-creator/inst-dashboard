"use client";

import { useOrders } from "@/hooks/portfolio/useOrders";

export default function OrdersGrid() {
  const { data, loading, error } = useOrders();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <h3 className="mb-2 font-semibold">Open Orders</h3>

      <table className="w-full text-sm mb-6">
        <thead>
          <tr>
            <th className="text-left p-2">Symbol</th>
            <th className="text-left p-2">Side</th>
            <th className="text-right p-2">Qty</th>
            <th className="text-right p-2">Price</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.open.map((o) => (
            <tr key={o.orderId}>
              <td className="p-2">{o.symbol}</td>
              <td className="p-2">{o.side}</td>
              <td className="text-right p-2">{o.quantity}</td>
              <td className="text-right p-2">?{o.price}</td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mb-2 font-semibold">Completed Orders</h3>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">Symbol</th>
            <th className="text-left p-2">Side</th>
            <th className="text-right p-2">Qty</th>
            <th className="text-right p-2">Price</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.completed.map((o) => (
            <tr key={o.orderId}>
              <td className="p-2">{o.symbol}</td>
              <td className="p-2">{o.side}</td>
              <td className="text-right p-2">{o.quantity}</td>
              <td className="text-right p-2">?{o.price}</td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
