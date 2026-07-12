"use client";

interface Props{
  rows:any[];
}

export default function PivotAnalysis({rows}:Props){

  return(

    <div className="h-full bg-[#11161d] rounded-xl border border-[#2a313b] overflow-x-auto overflow-y-auto hidescroll">

      <table className="w-max whitespace-nowrap text-[9px]">

        <thead className="sticky top-0 bg-[#0d1117] z-20">
          <tr className="border-b border-[#2a313b] text-[9px] font-semibold text-[#25d8c5]">
            <th colSpan={2}></th>
            <th colSpan={5} className="text-center border-l border-[#2a313b]">DAILY</th>
            <th colSpan={5} className="text-center border-l border-[#2a313b]">WEEKLY</th>
            <th colSpan={5} className="text-center border-l border-[#2a313b]">MONTHLY</th>
            <th colSpan={4} className="text-center border-l border-[#2a313b]">DECISION</th>
          </tr>

          <tr className="border-b border-[#2a313b] text-[#8e99a8]">
            <th className="sticky left-0 z-30 w-[140px] bg-[#0d1117] px-3 py-1 text-left">Symbol</th>
            <th className="sticky left-[140px] z-30 w-[90px] bg-[#0d1117] px-2 py-1 text-right">CMP</th>

            <th className="w-[72px] px-1 py-1 text-center">DPVT</th>
            <th className="w-[72px] px-1 py-1 text-center">DR1</th>
            <th className="w-[72px] px-1 py-1 text-center">DR2</th>
            <th className="w-[72px] px-1 py-1 text-center">DS1</th>
            <th className="w-[72px] px-1 py-1 text-center">DS2</th>

            <th className="w-[72px] px-1 py-1 text-center">WPVT</th>
            <th className="w-[72px] px-1 py-1 text-center">WR1</th>
            <th className="w-[72px] px-1 py-1 text-center">WR2</th>
            <th className="w-[72px] px-1 py-1 text-center">WS1</th>
            <th className="w-[72px] px-1 py-1 text-center">WS2</th>

            <th className="w-[72px] px-1 py-1 text-center">MPVT</th>
            <th className="w-[72px] px-1 py-1 text-center">MR1</th>
            <th className="w-[72px] px-1 py-1 text-center">MR2</th>
            <th className="w-[72px] px-1 py-1 text-center">MS1</th>
            <th className="w-[72px] px-1 py-1 text-center">MS2</th>

            <th className="w-[120px] px-1 py-1 text-center">Align</th>
            <th className="w-[90px] px-1 py-1 text-center">Bias</th>
            <th className="w-[60px] px-1 py-1 text-right">Score</th>
            <th className="w-[90px] px-1 py-1 text-center">Verdict</th>
          </tr>
        </thead>

        <tbody>

        {rows.map((r:any)=>(

          <tr key={r.symbol} className="border-t border-[#222933] hover:bg-[#161d26]">

            <td className="sticky left-0 z-10 w-[140px] bg-[#11161d] px-3 py-1 font-semibold text-[#25d8c5] drop-shadow-[0_0_6px_rgba(37,216,197,.45)]">{r.symbol}</td>

            <td className="sticky left-[140px] z-10 w-[90px] bg-[#11161d] px-2 py-1 text-right text-white">{r.cmp?.toFixed?.(2)}</td>

            <td className="px-2 py-1 text-center text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,.45)]">{r.dailyValue?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.dailyR1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.dailyR2?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.dailyS1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.dailyS2?.toFixed?.(2)}</td>

            <td className="px-2 py-1 text-center text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,.45)]">{r.weeklyValue?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.weeklyR1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.weeklyR2?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.weeklyS1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.weeklyS2?.toFixed?.(2)}</td>

            <td className="px-2 py-1 text-center text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,.45)]">{r.monthlyValue?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.monthlyR1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]">{r.monthlyR2?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.monthlyS1?.toFixed?.(2)}</td>
            <td className="px-2 py-1 text-center text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]">{r.monthlyS2?.toFixed?.(2)}</td>

            <td className="px-2 py-1 text-center text-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,.45)]">{r.alignment}</td>
            <td className="px-2 py-1 text-center text-amber-300 drop-shadow-[0_0_4px_rgba(252,211,77,.45)]">{r.bias}</td>
            <td className="px-2 py-1 text-right text-white">{r.score}</td>
            <td className="px-2 py-1 text-center text-lime-300 drop-shadow-[0_0_5px_rgba(163,230,53,.45)]">{r.verdict}</td>

          </tr>

        ))}

        </tbody>

      </table>

    </div>

  );

}

















