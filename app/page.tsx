import { app } from "@/lib/firebase";
import { kite } from "@/lib/kite";
import MarketSnapshot from "@/components/MarketSnapshot";
import UniverseViewer from "@/components/UniverseViewer";
export default function Home() {

  console.log(app);
  console.log(kite);
  const stocks = [
    {
      symbol: "RELIANCE",
      cmp: "2908.45",
      daily: "2878.50",
      weekly: "2856.30",
      monthly: "2748.10",
      delivery: "68.35%",
      bias: "Accumulation",
      score: 87,
    },
    {
      symbol: "TCS",
      cmp: "3865.70",
      daily: "3835.20",
      weekly: "3799.60",
      monthly: "3586.40",
      delivery: "64.21%",
      bias: "Accumulation",
      score: 79,
    },
    {
      symbol: "INFY",
      cmp: "1523.80",
      daily: "1505.20",
      weekly: "1487.30",
      monthly: "1395.60",
      delivery: "61.28%",
      bias: "Breakout Fuel",
      score: 72,
    },
    {
      symbol: "SBIN",
      cmp: "812.60",
      daily: "803.10",
      weekly: "788.40",
      monthly: "721.30",
      delivery: "54.18%",
      bias: "Breakout Fuel",
      score: 62,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex">

      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 p-5">

        <h1 className="text-3xl font-bold text-green-400">
          INST DASHBOARD
        </h1>

        <p className="text-zinc-500 mt-2 text-sm">
          Institutional Market Intelligence
        </p>

        <div className="mt-10 space-y-4">

          <div className="bg-green-500/10 border border-green-500 rounded-xl p-3 text-green-400">
            Dashboard
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Market Overview
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Stock Scanner
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Pivot Scanner
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            VWAP Scanner
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Delivery Analyzer
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Volume Analyzer
          </div>

          <div className="text-zinc-400 hover:text-white cursor-pointer">
            Liquidity Map
          </div>

        </div>

      </aside>

      <section className="flex-1 p-6 overflow-auto">

        <div className="flex justify-between items-center">

          <input
            placeholder="Search stocks, indices..."
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 w-[400px] outline-none"
          />

          <div className="flex gap-10">

            <div>
              <p className="text-zinc-500 text-sm">
                NIFTY 50
              </p>

              <p className="text-green-400 text-2xl font-bold">
                22,753.80
              </p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm">
                BANKNIFTY
              </p>

              <p className="text-green-400 text-2xl font-bold">
                48,512.30
              </p>
            </div>

          </div>

        </div>

        <div className="grid grid-cols-5 gap-5 mt-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-zinc-400">
              Market Breadth
            </h2>

            <p className="text-4xl font-bold text-green-400 mt-4">
              1423
            </p>

            <p className="text-red-400 mt-2">
              845 Declines
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-zinc-400">
              FII / DII Activity
            </h2>

            <p className="text-red-400 text-2xl mt-4">
              -1247 Cr
            </p>

            <p className="text-green-400 mt-2">
              +2341 Cr
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-zinc-400">
              Avg Delivery %
            </h2>

            <p className="text-4xl font-bold mt-4">
              62.48%
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-zinc-400">
              Market Sentiment
            </h2>

            <p className="text-4xl text-green-400 font-bold mt-4">
              BULLISH
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-zinc-400">
              Volatility Index
            </h2>

            <p className="text-4xl font-bold mt-4">
              12.48
            </p>
          </div>

        </div>

        <div className="grid grid-cols-4 gap-5 mt-8">

          <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">

            <h2 className="text-2xl font-bold text-blue-400">
              MULTI TIMEFRAME PIVOTS
            </h2>

            <table className="w-full mt-5">
              <thead>
                <tr className="text-zinc-500">
                  <th className="text-left p-2">TF</th>
                  <th className="text-left p-2">Pivot</th>
                  <th className="text-left p-2">R1</th>
                  <th className="text-left p-2">S1</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-t border-zinc-800">
                  <td className="p-2">Daily</td>
                  <td className="p-2">291.35</td>
                  <td className="p-2 text-green-400">297.70</td>
                  <td className="p-2 text-red-400">287.70</td>
                </tr>

                <tr className="border-t border-zinc-800">
                  <td className="p-2">Weekly</td>
                  <td className="p-2">291.11</td>
                  <td className="p-2 text-green-400">299.84</td>
                  <td className="p-2 text-red-400">282.38</td>
                </tr>

                <tr className="border-t border-zinc-800">
                  <td className="p-2">Monthly</td>
                  <td className="p-2">291.11</td>
                  <td className="p-2 text-green-400">305.67</td>
                  <td className="p-2 text-red-400">276.55</td>
                </tr>

              </tbody>
            </table>

          </div>

          <MarketSnapshot />
          <UniverseViewer />

          <div className="bg-green-950 border border-green-700 rounded-2xl p-5">

            <h2 className="text-xl font-bold text-green-400">
              SWING LEVELS
            </h2>

            <div className="space-y-3 mt-5">

              <div className="flex justify-between">
                <span>SL</span>
                <span>279.30</span>
              </div>

              <div className="flex justify-between">
                <span>MSP</span>
                <span>293.00</span>
              </div>

              <div className="flex justify-between">
                <span>NEP</span>
                <span>294.00</span>
              </div>

              <div className="flex justify-between">
                <span>RTL</span>
                <span>295.00</span>
              </div>

              <div className="flex justify-between">
                <span>STL</span>
                <span>285.00</span>
              </div>

              <div className="flex justify-between">
                <span>BO</span>
                <span className="text-yellow-400">
                  301.00
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-3xl font-bold mb-6">
            Institutional Scanner
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="text-left p-3">Symbol</th>
                <th className="text-left p-3">CMP</th>
                <th className="text-left p-3">Daily</th>
                <th className="text-left p-3">Weekly</th>
                <th className="text-left p-3">Monthly</th>
                <th className="text-left p-3">Delivery</th>
                <th className="text-left p-3">Bias</th>
                <th className="text-left p-3">Score</th>
              </tr>
            </thead>

            <tbody>

              {stocks.map((stock) => (

                <tr
                  key={stock.symbol}
                  className="border-b border-zinc-800 hover:bg-zinc-800"
                >

                  <td className="p-3 font-semibold">
                    {stock.symbol}
                  </td>

                  <td className="p-3">
                    {stock.cmp}
                  </td>

                  <td className="p-3">
                    {stock.daily}
                  </td>

                  <td className="p-3">
                    {stock.weekly}
                  </td>

                  <td className="p-3">
                    {stock.monthly}
                  </td>

                  <td className="p-3 text-green-400">
                    {stock.delivery}
                  </td>

                  <td className="p-3 text-yellow-400">
                    {stock.bias}
                  </td>

                  <td className="p-3 text-green-400 font-bold">
                    {stock.score}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}