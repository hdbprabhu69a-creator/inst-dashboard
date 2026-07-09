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

<div className="bg-zinc-950 border-y border-zinc-800 px-3 py-1">

  <div className="grid grid-cols-7 gap-3">

    <div>
      <div className="text-[8px] text-zinc-500 uppercase tracking-wide">CMP</div>
      <div className="text-[13px] font-semibold text-green-400 leading-none">
        {structure ? formatPrice((structure as any).cmp) : "-"}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase tracking-wide">VOL</div>
      <div className="text-[12px] text-cyan-400 leading-none">
        {formatVolume((structure as any)?.volume)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">OPEN</div>
      <div className="text-[12px] text-white leading-none">
        {formatPrice((structure as any)?.open)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">HIGH</div>
      <div className="text-[12px] text-green-400 leading-none">
        {formatPrice((structure as any)?.high)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">LOW</div>
      <div className="text-[12px] text-red-400 leading-none">
        {formatPrice((structure as any)?.low)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">PCLOSE</div>
      <div className="text-[12px] text-white leading-none">
        {formatPrice((structure as any)?.close)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">TOKEN</div>
      <div className="text-[12px] text-yellow-400 leading-none">
        {(structure as any)?.instrumentToken ?? "-"}
      </div>
    </div>

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

<div className="bg-zinc-950 border-y border-zinc-800 px-3 py-1">

  <div className="grid grid-cols-7 gap-3">

    <div>
      <div className="text-[8px] text-zinc-500 uppercase tracking-wide">CMP</div>
      <div className="text-[13px] font-semibold text-green-400 leading-none">
        {structure ? formatPrice((structure as any).cmp) : "-"}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase tracking-wide">VOL</div>
      <div className="text-[12px] text-cyan-400 leading-none">
        {formatVolume((structure as any)?.volume)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">OPEN</div>
      <div className="text-[12px] text-white leading-none">
        {formatPrice((structure as any)?.open)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">HIGH</div>
      <div className="text-[12px] text-green-400 leading-none">
        {formatPrice((structure as any)?.high)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">LOW</div>
      <div className="text-[12px] text-red-400 leading-none">
        {formatPrice((structure as any)?.low)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">PCLOSE</div>
      <div className="text-[12px] text-white leading-none">
        {formatPrice((structure as any)?.close)}
      </div>
    </div>

    <div>
      <div className="text-[8px] text-zinc-500 uppercase">TOKEN</div>
      <div className="text-[12px] text-yellow-400 leading-none">
        {(structure as any)?.instrumentToken ?? "-"}
      </div>
    </div>

  </div>

</div>

);

}


