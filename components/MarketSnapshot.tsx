"use client";

import { useKiteData } from "@/hooks/useKiteData";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function MarketSnapshot() {

  const {
    selectedStock,
  } = useSelectedStock();

  const {
    data,
    loading,
    error,
  } = useKiteData(selectedStock);

  if (loading) {
    return (
      <div className="bg-black border border-green-500 rounded-xl p-6">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-red-500 rounded-xl p-6 text-red-400">
        {error}
      </div>
    );
  }

  const quote =
    data?.[`NSE:${selectedStock}`];
    console.log("SELECTED =", selectedStock);
console.log("DATA =", data);
console.log("QUOTE =", quote);

  return (

    <div className="bg-black border border-green-500 rounded-xl p-6">

      <h2 className="text-green-400 text-xl font-bold mb-4">
        {selectedStock} LIVE
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div>

          <p className="text-gray-400">
            CMP
          </p>

          <p className="text-green-400 text-3xl font-bold">
            {quote?.last_price ?? "-"}
          </p>

        </div>

        <div>

          <p className="text-gray-400">
            Volume
          </p>

          <p className="text-white text-2xl">
            {quote?.volume && quote.volume > 0
              ? quote.volume.toLocaleString()
              : "N/A"}
          </p>

        </div>

        <div>

          <p className="text-gray-400">
            Day High
          </p>

          <p className="text-green-400">
            {quote?.ohlc?.high ?? "-"}
          </p>

        </div>

        <div>

          <p className="text-gray-400">
            Day Low
          </p>

          <p className="text-red-400">
            {quote?.ohlc?.low ?? "-"}
          </p>

        </div>

      </div>

    </div>

  );

}