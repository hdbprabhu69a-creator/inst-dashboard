"use client";

import PatternBreakout from "./PatternBreakout";
import PatternProjection from "./PatternProjection";
import PatternRiskReward from "./PatternRiskReward";
import PatternTarget from "./PatternTarget";

type Props={

breakout:number;

target:number;

stop:number;

};

export default function PatternRenderer({

breakout,

target,

stop,

}:Props){

return(

<div
className="
absolute
right-4
bottom-4
flex
flex-col
gap-2
w-52
">

<PatternBreakout

price={breakout}

/>

<PatternTarget

price={target}

/>

<PatternProjection

price={breakout}

target={target}

/>

<PatternRiskReward

entry={breakout}

target={target}

stop={stop}

/>

</div>

);

}

