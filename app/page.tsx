export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-green-400">
        INST Dashboard
      </h1>

      <p className="mt-4 text-gray-400 text-lg">
        Institutional Market Intelligence System
      </p>

      <div className="grid grid-cols-3 gap-6 mt-10">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
          <h2 className="text-2xl font-semibold text-blue-400">
            Pivot Structure
          </h2>

          <div className="mt-4 space-y-2 text-gray-300">
            <p>Daily Pivot: 2450</p>
            <p>Weekly Pivot: 2412</p>
            <p>Monthly Pivot: 2388</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
          <h2 className="text-2xl font-semibold text-yellow-400">
            VWAP Engine
          </h2>

          <div className="mt-4 space-y-2 text-gray-300">
            <p>CMP Above VWAP</p>
            <p>Volume Expansion Active</p>
            <p>Liquidity Trend Bullish</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
          <h2 className="text-2xl font-semibold text-red-400">
            Delivery Analytics
          </h2>

          <div className="mt-4 space-y-2 text-gray-300">
            <p>Delivery: 68%</p>
            <p>Strong Hand Activity</p>
            <p>Absorption Detected</p>
          </div>
        </div>
      </div>
    </main>
  );
}