"use client";

import React,{useRef} from "react";

export interface GridColumn{
  key:string;
  title:string;
  width:number;
  align?:"left"|"center"|"right";
  render?:(row:any)=>React.ReactNode;
}

interface Props{
  columns:GridColumn[];
  rows:any[];
  rowKey?:string;
}

function cellClass(key:string){

  const resistance=[
    "dailyR1","dailyR2","dailyR3",
    "weeklyR1","weeklyR2","weeklyR3",
    "monthlyR1","monthlyR2","monthlyR3"
  ];

  const support=[
    "dailyS1","dailyS2","dailyS3",
    "weeklyS1","weeklyS2","weeklyS3",
    "monthlyS1","monthlyS2","monthlyS3"
  ];

  if(key==="symbol")
    return "font-semibold text-[#25d8c5] drop-shadow-[0_0_6px_rgba(37,216,197,.45)]";

  if(key==="cmp"||key==="score")
    return "text-white";

  if(
    key.toLowerCase().includes("value") ||
    key.includes("Pivot") ||
    key.includes("PVT")
  )
    return "text-cyan-300 drop-shadow-[0_0_4px_rgba(103,232,249,.45)]";

  if(resistance.includes(key))
    return "text-green-300 drop-shadow-[0_0_4px_rgba(74,222,128,.45)]";

  if(support.includes(key))
    return "text-red-300 drop-shadow-[0_0_4px_rgba(248,113,113,.45)]";

  if(key==="alignment")
    return "text-emerald-300";

  if(key==="bias")
    return "text-amber-300";

  if(key==="verdict")
    return "text-lime-300";

  return "text-white";
}

export default function GridTable({columns,rows,rowKey="symbol"}:Props){

const ref=useRef<HTMLDivElement>(null);

const drag=useRef(false);
const sx=useRef(0);
const sy=useRef(0);
const sl=useRef(0);
const st=useRef(0);

const template=columns.map(c=>`${c.width}px`).join(" ");

return(

<div
ref={ref}
className="h-full overflow-auto rounded-xl border border-[#2a313b] bg-[#11161d] cursor-grab active:cursor-grabbing"
style={{
scrollbarWidth:"none",
msOverflowStyle:"none"
}}
onMouseDown={e=>{
drag.current=true;
sx.current=e.pageX;
sy.current=e.pageY;
sl.current=ref.current!.scrollLeft;
st.current=ref.current!.scrollTop;
}}
onMouseLeave={()=>drag.current=false}
onMouseUp={()=>drag.current=false}
onMouseMove={e=>{
if(!drag.current)return;
e.preventDefault();
ref.current!.scrollLeft=sl.current-(e.pageX-sx.current);
ref.current!.scrollTop=st.current-(e.pageY-sy.current);
}}
>

<style>{`
div::-webkit-scrollbar{display:none;}
`}</style>

<div
className="min-w-max"
style={{
display:"grid",
gridTemplateColumns:template
}}
>

{columns.map(c=>

<div
key={c.key}
className={`sticky top-0 z-30 bg-[#0d1117] border-r border-b border-[#2a313b] px-2 py-2 text-[10px] font-semibold text-[#25d8c5] ${c.key==="symbol"?"left-0":c.key==="cmp"?"left-[140px]":""}`}
style={{textAlign:c.align??"center"}}
>
{c.title}
</div>

)}

{rows.flatMap((r:any)=>

columns.map(c=>

<div
key={r[rowKey]+"_"+c.key}
className={`border-r border-b border-[#222933] px-2 py-1 whitespace-nowrap hover:bg-[#161d26] ${cellClass(c.key)} ${c.key==="symbol"?"sticky left-0 z-10 bg-[#11161d]":c.key==="cmp"?"sticky left-[140px] z-10 bg-[#11161d]":""}`}
style={{textAlign:c.align??"center"}}
>
{c.render?c.render(r):r[c.key]}
</div>

)

)}

</div>

</div>

);

}

