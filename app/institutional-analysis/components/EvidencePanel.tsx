interface EvidencePanelProps{
  result?:any;
}

export default function EvidencePanel({
  result
}:EvidencePanelProps){

  const s=result?.structure;
  const i=result?.integrity;

  return(

    <div className="rounded-lg border border-[#2a313b] bg-[#10151d] h-full flex flex-col">

      <div className="h-10 border-b border-[#2a313b] flex items-center px-3 font-semibold text-[#22d3ee]">
        EVIDENCE ENGINE
      </div>

      <div className="flex-1 p-3 space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Market Structure</span>
          <span className="text-green-400">
            {s?.structure ?? "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Trend Phase</span>
          <span className="text-[#22d3ee]">
            {result?.phase ?? "--"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Structure Integrity</span>
          <span className={
            i?.intact
            ? "text-green-400"
            : "text-red-400"
          }>
            {i?.verdict ?? "--"}
          </span>
        </div>

        <div className="border-t border-[#2a313b] my-2"></div>

        <div className="text-green-400">
          ? Higher Highs : {s?.higherHighs ?? "--"}
        </div>

        <div className="text-green-400">
          ? Higher Lows : {s?.higherLows ?? "--"}
        </div>

        <div className="text-red-400">
          ? Lower Highs : {s?.lowerHighs ?? "--"}
        </div>

        <div className="text-red-400">
          ? Lower Lows : {s?.lowerLows ?? "--"}
        </div>

      </div>

    </div>

  );

}


