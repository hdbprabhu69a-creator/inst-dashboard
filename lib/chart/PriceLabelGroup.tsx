"use client";

import PriceLabel from "./PriceLabel";

type Props={

breakout:number;

target:number;

stop:number;

};

export default function PriceLabelGroup({

breakout,

target,

stop,

}:Props){

return(

<>

<PriceLabel

text="BREAKOUT"

price={breakout}

color="#16a34a"

top={80}

/>

<PriceLabel

text="TARGET"

price={target}

color="#2563eb"

top={145}

/>

<PriceLabel

text="STOP"

price={stop}

color="#dc2626"

top={210}

/>

</>

);

}

