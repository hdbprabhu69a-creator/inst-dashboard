"use client";

import { usePortfolio } from "@/hooks/portfolio/usePortfolio";

export default function PortfolioSummary() {
  const { data, loading, error } = usePortfolio();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No portfolio data.</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Net Worth</div>
        <div className="text-2xl font-bold">
          ?{data.netWorth.toLocaleString()}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Day P&L</div>
        <div className="text-2xl font-bold">
          ?{data.dayPnL.toLocaleString()}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Buying Power</div>
        <div className="text-2xl font-bold">
          ?{data.buyingPower.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
