"use client";

interface Props{

search:string;
setSearch:(v:string)=>void;

sectorFilter:string;
setSectorFilter:(v:string)=>void;

sectorList:string[];

swingFilter:string;
setSwingFilter:(v:string)=>void;

volPeriod:string;
setVolPeriod:(v:string)=>void;

filtered:number;
total:number;

}

export default function Toolbar({

search,
setSearch,

sectorFilter,
setSectorFilter,

sectorList,

swingFilter,
setSwingFilter,

volPeriod,
setVolPeriod,

filtered,
total,

}:Props){

return(

<div className="sticky top-0 z-50 mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2">

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search Symbol..."
className="w-60 rounded border border-zinc-700 bg-black px-3 py-2 text-cyan-300 outline-none placeholder:text-zinc-600"
/>

<select
value={sectorFilter}
onChange={e=>setSectorFilter(e.target.value)}
className="rounded border border-zinc-700 bg-black px-3 py-2 text-yellow-300"
>

{sectorList.map(sector=>(

<option
key={sector}
value={sector}
>

{sector}

</option>

))}

</select>

<select
value={swingFilter}
onChange={e=>setSwingFilter(e.target.value)}
className="rounded border border-zinc-700 bg-black px-3 py-2 text-lime-300"
>

<option value="ALL">All Swings</option>

<option value="1W">1 Week</option>

<option value="2W">2 Week</option>

<option value="1M">1 Month</option>

<option value="3M">3 Month</option>

<option value="6M">6 Month</option>

<option value="1Y">1 Year</option>

<option disabled>--------</option>

<option value="PIVOT">Pivot</option>
<option value="VOLDEL">Vol / Del</option>
<option value="VOLDEL">Vol / Del</option>

</select>

{(swingFilter==="VOLDEL") && (

<select
value={volPeriod}
onChange={(e)=>setVolPeriod(e.target.value)}
className="rounded-md border border-zinc-700 bg-black px-4 py-2 text-lime-300"
>

<option value="1W">1 Week</option>
<option value="2W">2 Week</option>
<option value="1M">1 Month</option>

</select>

)}

<button
className="rounded border border-cyan-700 bg-cyan-900 px-4 py-2 font-semibold text-cyan-200 hover:bg-cyan-800"
>

Export CSV

</button>

<div className="ml-auto rounded border border-zinc-700 bg-black px-3 py-2 font-semibold text-cyan-300">

Showing {filtered} / {total}

</div>

</div>

);

}



