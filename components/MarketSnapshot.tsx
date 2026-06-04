"use client";

import { useKiteData } from "@/hooks/useKiteData";
import { useSelectedStock } from "@/src/context/SelectedStockContext";

export default function MarketSnapshot() {

  const { selectedStock } =
    useSelectedStock();

  const {
    data,
    loading,
    error,
  } = useKiteData(selectedStock);

  const quote =
    data?.quote?.[
      `NSE:${selectedStock}`
    ];

  const formatPrice = (
    value: number
  ) => {

    return Number(
      value || 0
    ).toFixed(2);

  };

  const formatVolume = (
    volume: number
  ) => {

    if (!volume)
      return "0";

    if (
      volume >= 10000000
    ) {

      return (
        (
          volume / 10000000
        ).toFixed(2) + " Cr"
      );

    }

    if (
      volume >= 100000
    ) {

      return (
        (
          volume / 100000
        ).toFixed(2) + " L"
      );

    }

    return volume.toLocaleString();

  };

  if (loading) {

    return (

      <div className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-2">

        Loading...

      </div>

    );

  }

  if (error) {

    return (

      <div className="col-span-4 bg-zinc-900 border border-red-500 rounded-xl p-2 text-red-400">

        {error}

      </div>

    );

  }

  return (

    <div className="col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-2">

      <div className="grid grid-cols-6 gap-3">

        <div>

          <p className="text-zinc-500 text-xs">
            CMP
          </p>

          <p className="text-green-400 text-lg font-bold">

            {quote?.last_price
              ? formatPrice(
                  quote.last_price
                )
              : "-"}

          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-xs">
            VOL
          </p>

          <p className="text-cyan-400 text-sm font-semibold">

            {formatVolume(
              quote?.volume || 0
            )}

          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-xs">
            OPEN
          </p>

          <p className="text-white text-sm">

            {formatPrice(
              quote?.ohlc?.open || 0
            )}

          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-xs">
            HIGH
          </p>

          <p className="text-green-400 text-sm">

            {formatPrice(
              quote?.ohlc?.high || 0
            )}

          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-xs">
            LOW
          </p>

          <p className="text-red-400 text-sm">

            {formatPrice(
              quote?.ohlc?.low || 0
            )}

          </p>

        </div>

        <div>

          <p className="text-zinc-500 text-xs">
            PCLOSE
          </p>

          <p className="text-white text-sm">

            {formatPrice(
              quote?.ohlc?.close || 0
            )}

          </p>

        </div>

      </div>

    </div>

  );

}