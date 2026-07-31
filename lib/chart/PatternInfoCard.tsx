"use client";

import PatternBadge from "./PatternBadge";

type Props={

pattern:string;

confidence:number;

breakout:number;

target:number;

stop:number;

};

export default function PatternInfoCard({

pattern,

confidence,

breakout,

target,

stop,

}:Props){

return(

<div
className="
absolute
top-4
right-4
w-64
rounded-xl
border
border-zinc-700
bg-[#131722ee]
backdrop-blur
shadow-2xl
p-4
space-y-3
">

<div>

<div className="text-xs text-zinc-500">

Detected Pattern

</div>

<div className="text-xl font-bold text-cyan-400">

{pattern}

</div>

</div>

<div className="grid grid-cols-2 gap-2">

<PatternBadge

title="Confidence"

value={confidence+"%"}

color="#22c55e"

/>

<PatternBadge

title="Breakout"

value={"? "+breakout.toFixed(2)}

color="#22c55e"

/>

<PatternBadge

title="Target"

value={"? "+target.toFixed(2)}

color="#3b82f6"

/>

<PatternBadge

title="Stop"

value={"? "+stop.toFixed(2)}

color="#ef4444"

/>

</div>

</div>

);

}

