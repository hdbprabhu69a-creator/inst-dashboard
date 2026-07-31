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

<div className="border-b border-zinc-800 px-2 py-[2px] overflow-x-auto">

  <div className="flex items-center gap-6 whitespace-nowrap text-[10px]">

    <span><span className="text-zinc-500">CMP</span> <span className="text-green-400 font-semibold">{structure ? formatPrice((structure as any).cmp) : "-"}</span></span>

    <span><span className="text-zinc-500">VOL</span> <span className="text-cyan-400">{formatVolume((structure as any)?.volume)}</span></span>

    <span><span className="text-zinc-500">O</span> <span className="text-white">{formatPrice((structure as any)?.open)}</span></span>

    <span><span className="text-zinc-500">H</span> <span className="text-green-400">{formatPrice((structure as any)?.high)}</span></span>

    <span><span className="text-zinc-500">L</span> <span className="text-red-400">{formatPrice((structure as any)?.low)}</span></span>

    <span><span className="text-zinc-500">PC</span> <span className="text-white">{formatPrice((structure as any)?.close)}</span></span>

    <span><span className="text-zinc-500">TK</span> <span className="text-yellow-400">{(structure as any)?.instrumentToken ?? "-"}</span></span>

  </div>

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

<div className="border-b border-zinc-800 px-2 py-[2px] overflow-x-auto">

  <div className="flex items-center gap-6 whitespace-nowrap text-[10px]">

    <span><span className="text-zinc-500">CMP</span> <span className="text-green-400 font-semibold">{structure ? formatPrice((structure as any).cmp) : "-"}</span></span>

    <span><span className="text-zinc-500">VOL</span> <span className="text-cyan-400">{formatVolume((structure as any)?.volume)}</span></span>

    <span><span className="text-zinc-500">O</span> <span className="text-white">{formatPrice((structure as any)?.open)}</span></span>

    <span><span className="text-zinc-500">H</span> <span className="text-green-400">{formatPrice((structure as any)?.high)}</span></span>

    <span><span className="text-zinc-500">L</span> <span className="text-red-400">{formatPrice((structure as any)?.low)}</span></span>

    <span><span className="text-zinc-500">PC</span> <span className="text-white">{formatPrice((structure as any)?.close)}</span></span>

    <span><span className="text-zinc-500">TK</span> <span className="text-yellow-400">{(structure as any)?.instrumentToken ?? "-"}</span></span>

  </div>

</div>

);

}


