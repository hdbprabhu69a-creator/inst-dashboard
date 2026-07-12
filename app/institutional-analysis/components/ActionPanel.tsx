export default function ActionPanel() {

  return (

    <div className="rounded-lg border border-[#2a313b] bg-[#10151d] h-full flex flex-col">

      <div className="h-10 border-b border-[#2a313b] flex items-center px-4 font-semibold">
        FINAL DECISION
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">

        <div className="text-4xl font-bold text-[#22d3ee]">
          WAIT
        </div>

        <div className="text-sm text-[#b8c1cc] text-center px-6">
          Execute Trend, Pattern, Volume, VWAP, CPR,
          Delivery and Portfolio engines before
          generating the final institutional verdict.
        </div>

        <div className="grid grid-cols-2 gap-3 w-[90%]">

          <button className="rounded bg-green-700 hover:bg-green-600 py-2 font-semibold">
            BUY
          </button>

          <button className="rounded bg-blue-700 hover:bg-blue-600 py-2 font-semibold">
            HOLD
          </button>

          <button className="rounded bg-yellow-700 hover:bg-yellow-600 py-2 font-semibold">
            WATCH
          </button>

          <button className="rounded bg-red-700 hover:bg-red-600 py-2 font-semibold">
            AVOID
          </button>

        </div>

      </div>

    </div>

  );

}


