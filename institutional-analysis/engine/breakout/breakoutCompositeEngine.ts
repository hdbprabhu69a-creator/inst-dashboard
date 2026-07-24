export function breakoutCompositeEngine(input:any[]){

const rows:any[]=[];

for(const stock of input){

const cmp=Number(stock.cmp||0);

let score=0;


// LIQUIDITY 15

const avgVolume=
Number(stock.mvol||0)/20;

if(avgVolume>500000)
score+=15;
else if(avgVolume>100000)
score+=10;


// STRUCTURE 20

const trendScore=Number(stock.score||0);
const confidence=Number(stock.confidence||0);
const trendVerdict=String(stock.verdict||"");

if(
    trendVerdict==="ACC" &&
    trendScore>=60 &&
    confidence>=70
)
    score+=20;
else if(
    trendVerdict==="HOLD" &&
    trendScore>=50
)
    score+=10;

// RESISTANCE 20

const resistance=
Number(stock.oneWeekHigh||0);

let breakoutDistance=999;

if(resistance>0){

breakoutDistance=
((cmp-resistance)/resistance)*100;

if(
breakoutDistance>=0 &&
breakoutDistance<=2
)
score+=20;

}


// PARTICIPATION 25

const rv=
Number(stock.relativeVolume??stock.relativeDailyVolume??0);

const delivery=
Number(stock.deliveryPctDaily||0);


if(rv>=1.5)
score+=15;
else if(rv>=1)
score+=8;


if(delivery>=50)
score+=10;


// CONFIRMATION 10

const high=
Number(stock.high||0);

const low=
Number(stock.low||0);

const close=
Number(stock.close||0);


let closeStrength=0;

if(high>low){

closeStrength=
((close-low)/(high-low))*100;

if(closeStrength>=75)
score+=10;

}


// RISK 10

const swingLow=
Number(stock.oneWeekLow||0);

let rr=0;

if(cmp>swingLow){

const risk=cmp-swingLow;

const reward=resistance-cmp;

if(risk>0){

rr=reward/risk;

if(rr>=2)
score+=10;

}

}


// OUTPUT

console.log(
"BREAKOUT DEBUG",
stock.symbol,
"score",
score,
"cmp",
cmp,
"high",
resistance,
"rv",
rv,
"delivery",
stock.deliveryPctDaily,
"structure",
stock.structure
);

const isBreakout=
    breakoutDistance>=0 &&
    breakoutDistance<=2;

const hasParticipation=
    Number(stock.institutionalScore??0)>=60 &&
    stock.participation!=="Retail" &&
    stock.buyingSellingClimax!=="Buying Climax";

if(stock.priceVolumeConfirmation==="Bullish")
    score+=5;

if(stock.breakoutConfirmation==="Yes")
    score+=10;


const hasTrend=
    trendVerdict==="ACC";

if(
    score>=65 &&
    isBreakout &&
    hasParticipation &&
    hasTrend
){

rows.push({

...stock,

breakoutScore:Math.round(score),

breakoutDistance,

closeStrength,

rr,

verdict:

score>=80

?"INSTITUTIONAL BREAKOUT"

:"WATCH BREAKOUT"

});

}

}


return rows.sort(
(a,b)=>b.breakoutScore-a.breakoutScore
);

}








