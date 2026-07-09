import React from "react";
import StockStateTable from "@/components/marketState/StockStateTable";

const summary = [
  { title: "ACCUMULATION", value: 18 },
  { title: "COMPRESSION", value: 24 },
  { title: "EXPANSION", value: 16 },
  { title: "MARKUP", value: 22 },
  { title: "DISTRIBUTION", value: 9 },
  { title: "MARKDOWN", value: 10 },
];

const stocks = [
  ["SBIN","Expansion","91%","Strong","Markup"],
  ["SRF","Compression","88%","Strong","Expansion"],
  ["TATAPOWER","Accumulation","84%","Normal","Expansion"],
  ["BLUESTAR","Distribution","82%","Normal","Markdown"],
  ["KVB","Markup","95%","Strong","Distribution"],
];

export default function MarketStatePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">

      <h1 className="text-3xl font-bold tracking-wide">
        MARKET STATE DESK
      </h1>

      <p className="text-sm text-zinc-400 mt-2">
        Institutional Market State Engine
      </p>

      <div className="grid grid-cols-5 gap-3 mt-6 text-sm">

        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          Universe
          <div className="text-2xl font-bold mt-2">99</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          Regime
          <div className="text-xl font-semibold mt-2 text-green-400">
            Bullish
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          Market Energy
          <div className="text-2xl font-bold mt-2">
            72%
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          Bullish
          <div className="text-2xl font-bold mt-2">
            41
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          Bearish
          <div className="text-2xl font-bold mt-2">
            25
          </div>
        </div>

      </div>

      <div className="grid grid-cols-6 gap-3 mt-6">

        {summary.map((s)=>(
          <div
            key={s.title}
            className="bg-zinc-900 border border-zinc-800 rounded p-4 text-center"
          >
            <div className="text-xs text-zinc-400">
              {s.title}
            </div>

            <div className="text-3xl font-bold mt-3">
              {s.value}
            </div>
          </div>
        ))}

      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">

        <section className="bg-zinc-900 border border-zinc-800 rounded p-5">
          <h2 className="font-semibold mb-4">
            MARKET BREADTH
          </h2>

          <div className="space-y-2 text-sm">
            <div>Bullish States : 41</div>
            <div>Neutral States : 33</div>
            <div>Bearish States : 25</div>
            <div>Expansion Probability : 68%</div>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded p-5">
          <h2 className="font-semibold mb-4">
            TRANSITION MONITOR
          </h2>

          <div className="space-y-2 text-sm">
            <div>Compression ? Expansion : 8</div>
            <div>Expansion ? Markup : 6</div>
            <div>Markup ? Distribution : 3</div>
            <div>Markdown ? Accumulation : 4</div>
          </div>
        </section>

      </div>

      <StockStateTable />

    </main>
  );
}

