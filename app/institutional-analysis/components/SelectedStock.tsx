interface SelectedStockProps{
  result:any;
}

export default function SelectedStock({
  result
}:SelectedStockProps){

  const s=result?.structure;
  const i=result?.integrity;
  const st=result?.strength;
  const c=result?.confidence;

  return(

    <div className="rounded-lg border border-[#2a313b] bg-[#10151d] flex flex-col h-full">

      <div className="h-12 border-b border-[#2a313b] flex items-center px-4 font-semibold">
        SELECTED STOCK
      </div>

      <div className="flex-1 p-4 space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Symbol</span>
          <span>{result?.symbol ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Structure</span>
          <span>{s?.structure ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Phase</span>
          <span>{result?.phase ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Integrity</span>
          <span>{i?.verdict ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Strength</span>
          <span>{st?.strength ?? "--"} ({st?.score ?? "--"})</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Confidence</span>
          <span>{c?.confidence ?? "--"} ({c?.score ?? "--"})</span>
        </div>

        <hr className="border-[#2a313b]"/>

        <div className="grid grid-cols-2 gap-2">

          <div className="bg-[#0a0d12] rounded p-2">
            HH : {s?.higherHighs ?? "--"}
          </div>

          <div className="bg-[#0a0d12] rounded p-2">
            HL : {s?.higherLows ?? "--"}
          </div>

          <div className="bg-[#0a0d12] rounded p-2">
            LH : {s?.lowerHighs ?? "--"}
          </div>

          <div className="bg-[#0a0d12] rounded p-2">
            LL : {s?.lowerLows ?? "--"}
          </div>

        </div>

        <hr className="border-[#2a313b]"/>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Protected Level</span>
          <span>{i?.protectedLevel ?? "--"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#b8c1cc]">Break Distance</span>
          <span>{i?.breakDistance ?? "--"}</span>
        </div>

      </div>

    </div>

  );

}



