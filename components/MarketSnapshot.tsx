"use client";

import { useKiteData } from "@/hooks/useKiteData";

export default function MarketSnapshot() {
  const { data, loading } = useKiteData();

  if (loading) {
    return <div>Loading...</div>;
  }

  const kvb = data?.["NSE:KARURVYSYA"];

  return (
    <div className="bg-black border border-green-500 rounded-xl p-6">

      <h2 className="text-green-400 text-xl font-bold mb-4">
        KARURVYSYA LIVE
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-gray-400">CMP</p>
          <p className="text-green-400 text-3xl font-bold">
            {kvb?.last_price}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Volume</p>
          <p className="text-white text-2xl">
            {kvb?.volume}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Day High</p>
          <p className="text-green-400">
            {kvb?.ohlc.high}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Day Low</p>
          <p className="text-red-400">
            {kvb?.ohlc.low}
          </p>
        </div>

      </div>

    </div>
  );
}