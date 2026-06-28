"use client";

type Props={

entry:number;

target:number;

stop:number;

};

export default function PatternRiskReward({

entry,

target,

stop,

}:Props){

const reward=

Math.abs(

target-entry

);

const risk=

Math.abs(

entry-stop

);

const rr=

risk===0

?0

:reward/risk;

return(

<div
className="
rounded-lg
border
border-zinc-700
bg-[#131722]
px-3
py-2
">

<div className="text-xs text-zinc-500">

Risk Reward

</div>

<div className="font-bold text-yellow-400">

1 :

{rr.toFixed(2)}

</div>

</div>

);

}
