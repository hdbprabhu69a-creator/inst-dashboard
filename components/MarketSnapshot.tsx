"use client";

import {
  useMarketSnapshot,
} from "@/hooks/useMarketSnapshot";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

import {
  formatPrice,
  formatVolume,
} from "@/src/lib/formatters";

export default function MarketSnapshot() {

  const {
    selectedStock,
  } = useSelectedStock();

  const {
    structure,
    loading,
    error,
  } = useMarketSnapshot(
    selectedStock
  );

  if (loading) {

    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1">
        Loading...
      </div>
    );

  }

  if (error) {

    return (
      <div className="bg-zinc-900 border border-red-500 rounded-xl px-3 py-1 text-red-400">
        {error}
      </div>
    );

  }

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1">

      <div className="grid grid-cols-7 gap-2">

        <div>
          <p className="text-zinc-500 text-xs">
            CMP
          </p>

          <p className="text-green-400 text-base font-bold">
            {structure
              ? formatPrice(
                  structure.ltp
                )
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            VOL
          </p>

          <p className="text-cyan-400 text-xs font-semibold">
            {formatVolume(
              structure?.volume || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            OPEN
          </p>

          <p className="text-white text-xs">
            {formatPrice(
              structure?.open || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            HIGH
          </p>

          <p className="text-green-400 text-xs">
            {formatPrice(
              structure?.high || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            LOW
          </p>

          <p className="text-red-400 text-xs">
            {formatPrice(
              structure?.low || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            PCLOSE
          </p>

          <p className="text-white text-xs">
            {formatPrice(
              structure?.close || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-xs">
            TOKEN
          </p>

          <p className="text-yellow-400 text-xs font-semibold">
            {structure
              ?.instrument_token || "-"}
          </p>
        </div>

      </div>

    </div>

  );

}