"use client";

interface UniverseRow{
  rank:number;
  symbol:string;
  score:number;
  structure:string;
  phase:string;
  verdict:string;
  confidence:number;
}

interface Props{
  rows:UniverseRow[];
  onSelect:(symbol:string)=>void;
}

export default function UniverseTable({
  rows,
  onSelect
}:Props){

  return(

    <div className="h-full overflow-auto hidescroll">

      <table className="w-full table-fixed text-sm">

        <thead className="sticky top-0 bg-[#11161d] z-10">

          <tr className="border-b border-[#2a313b] text-[#008487]">

            <th className="w-12 p-2 text-left">#</th>
            <th className="w-28 p-2 text-left">Symbol</th>
            <th className="w-20 p-2 text-right">Score</th>
            <th className="w-36 p-2 text-left">Structure</th>
            <th className="w-40 p-2 text-left">Phase</th>
            <th className="w-32 p-2 text-left">Verdict</th>
            <th className="w-20 p-2 text-right">Conf</th>

          </tr>

        </thead>

        <tbody>

          {rows.map(r=>(

            <tr
              key={r.symbol}
              onClick={()=>onSelect(r.symbol)}
              className="cursor-pointer border-b border-[#2a313b] hover:bg-[#11161d]"
            >

              <td className="p-2">{r.rank}</td>
              <td className="p-2 font-semibold text-cyan-300">{r.symbol}</td>
              <td className="p-2 text-right">{r.score}</td>
              <td className="p-2">{r.structure}</td>
              <td className="p-2">{r.phase}</td>
              <td className="p-2">{r.verdict}</td>
              <td className="p-2 text-right">{r.confidence}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}






