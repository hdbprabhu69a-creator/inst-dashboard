"use client";

interface Props{
  swingFilter:string;
  volPeriod:string;
  headerDates:string[];
}

export default function TableHeader({
  swingFilter,
  volPeriod,
  headerDates,
}:Props){

const show=(v:string)=>

swingFilter!=="VOLDEL" && (

swingFilter==="ALL"||

swingFilter===v

);

return(

<thead>

<tr className="bg-zinc-950">

<th className="sticky left-0 z-50  border border-zinc-800 bg-black text-center text-cyan-300">
SYM
</th>
<th className="sticky left-[80px] z-50 border border-zinc-800 bg-black text-center text-lime-300">
CMP
</th>

{swingFilter==="VOLDEL" && (

<>

<th className="border border-zinc-700 bg-zinc-950 text-center">
Type
</th>

{headerDates.map((d,i)=>(

<th
key={i}
className="border border-zinc-700 bg-zinc-950 px-1 py-1 text-center whitespace-nowrap"
>

{d}

</th>

))}

</>

)}
{show("1W")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1W H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1W HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1W L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1W LD</th>
</>
)}

{show("2W")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">2W H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">2W HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">2W L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">2W LD</th>
</>
)}

{show("1M")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1M H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1M HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1M L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1M LD</th>
</>
)}

{show("3M")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">3M H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">3M HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">3M L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">3M LD</th>
</>
)}

{show("6M")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">6M H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">6M HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">6M L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">6M LD</th>
</>
)}

{show("1Y")&&(
<>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1Y H</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1Y HD</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1Y L</th>
<th className=" border border-zinc-800 px-0.5 py-1 px-0.5 py-1 text-center">1Y LD</th>
</>
)}

{swingFilter!=="PIVOT" && swingFilter!=="VOLDEL" && (

<>

<th className="border border-green-700 bg-green-950 px-0.5 py-1 text-center">23.6</th>
<th className="border border-green-700 bg-green-950 px-0.5 py-1 text-center">38.2</th>
<th className="border border-green-700 bg-green-950 px-0.5 py-1 text-center">50</th>
<th className="border border-green-700 bg-green-950 px-0.5 py-1 text-center">61.8</th>
<th className="border border-green-700 bg-green-950 px-0.5 py-1 text-center">78.6</th>

</>

)}

{swingFilter==="PIVOT" ? (

<>

<th className="border border-red-900 text-center">DS3</th>
<th className="border border-red-800 text-center">DS2</th>
<th className="border border-orange-700 text-center">DS1</th>
<th className="border border-cyan-700 text-center font-bold">DP</th>
<th className="border border-green-700 text-center">DR1</th>
<th className="border border-green-800 text-center">DR2</th>
<th className="border border-green-900 text-center">DR3</th>

<th className="border-l-2 border-l-zinc-600 border border-red-900 text-center">WS3</th>
<th className="border border-red-800 text-center">WS2</th>
<th className="border border-orange-700 text-center">WS1</th>
<th className="border border-cyan-700 text-center font-bold">WP</th>
<th className="border border-green-700 text-center">WR1</th>
<th className="border border-green-800 text-center">WR2</th>
<th className="border border-green-900 text-center">WR3</th>

<th className="border-l-2 border-l-zinc-600 border border-red-900 text-center">MS3</th>
<th className="border border-red-800 text-center">MS2</th>
<th className="border border-orange-700 text-center">MS1</th>
<th className="border border-cyan-700 text-center font-bold">MP</th>
<th className="border border-green-700 text-center">MR1</th>
<th className="border border-green-800 text-center">MR2</th>
<th className="border border-green-900 text-center">MR3</th>

</>

) : swingFilter==="VOLDEL" ? (

<>

<th className="border border-zinc-700 text-center">Type</th>

{headerDates.map((d,i)=>{

const last=i===headerDates.length-1;

return(

<th
key={i}
className="border border-cyan-800 bg-zinc-950 px-1 py-1 text-center whitespace-nowrap"
>

{d}

</th>

);

})}

</>

) : (

<>

<th className="border border-cyan-800 text-center">DP</th>
<th className="border border-cyan-800 text-center">WP</th>
<th className="border border-cyan-800 text-center">MP</th>

</>

)}

</tr>

</thead>

);

}
















