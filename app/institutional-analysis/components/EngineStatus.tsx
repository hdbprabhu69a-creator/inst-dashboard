interface EngineStatusProps{
  result?:any;
}

export default function EngineStatus({
  result
}:EngineStatusProps){

  return(

    <div className="rounded-lg border border-[#2a313b] bg-[#10151d] h-full flex flex-col">

      <div className="h-10 border-b border-[#2a313b] flex items-center px-3 text-sm font-semibold text-[#22d3ee]">
        ENGINE STATUS
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 p-3 text-xs">

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Trend</span>
          <span className="text-green-400">READY</span>
        </div>

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Swing</span>
          <span className="text-green-400">READY</span>
        </div>

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Structure</span>
          <span className="text-green-400">
            {result?.structure?.structure ?? "--"}
          </span>
        </div>

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Integrity</span>
          <span className={
            result?.integrity?.intact
              ? "text-green-400"
              : "text-red-400"
          }>
            {result?.integrity?.verdict ?? "--"}
          </span>
        </div>

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Strength</span>
          <span className="text-[#22d3ee]">
            {result?.strength?.score ?? "--"}
          </span>
        </div>

        <div className="rounded bg-[#0a0d12] p-2 flex justify-between">
          <span>Confidence</span>
          <span className="text-yellow-400">
            {result?.confidence?.score ?? "--"}
          </span>
        </div>

      </div>

    </div>

  );

}


