type Candle = {
  close:number;
  high:number;
  low:number;
};


function sma(
 values:number[],
 period:number
){

 if(values.length < period)
   return null;

 const arr =
   values.slice(-period);

 return arr.reduce(
   (a,b)=>a+b,
   0
 ) / period;

}



function ema(
 values:number[],
 period:number
){

 if(values.length < period)
   return null;


 const k =
   2/(period+1);

 let result =
   values[0];


 for(let i=1;i<values.length;i++){

   result =
     values[i]*k +
     result*(1-k);

 }

 return result;

}



function rsi(
 closes:number[],
 period=14
){

 let gain=0;
 let loss=0;


 for(
  let i=closes.length-period;
  i<closes.length;
  i++
 ){

   const diff =
     closes[i]-closes[i-1];


   if(diff>0)
     gain+=diff;
   else
     loss+=Math.abs(diff);

 }


 if(loss===0)
   return 100;


 const rs =
   gain/loss;


 return 100-(100/(1+rs));

}



function calculateADX(
 candles:Candle[]
){

 if(candles.length < 20)
   return 20;


 let moves=0;


 for(
  let i=candles.length-14;
  i<candles.length;
  i++
 ){

   moves +=
    Math.abs(
      candles[i].high -
      candles[i-1].high
    );

 }


 return Math.min(
   50,
   moves/10
 );

}



export function analyzeIndexRegime(
 candles:Candle[]
){

 if(candles.length < 50){

  return {

   regime:"UNKNOWN",

   confidence:0

  };

 }


 const closes =
   candles.map(
    c=>c.close
   );


 const last =
   closes.at(-1)!;


 const dma21 =
   sma(
    closes,
    21
   );


 const dma30 =
   sma(
    closes,
    30
   );


 const rsiValue =
   rsi(
    closes
   );


 const ema12 =
   ema(
    closes,
    12
   );


 const ema26 =
   ema(
    closes,
    26
   );


 const macd =
   (ema12 ?? 0) -
   (ema26 ?? 0);



 const adx =
   calculateADX(
    candles
   );



 const high15 =
   Math.max(
    ...closes.slice(-15)
   );


 const low15 =
   Math.min(
    ...closes.slice(-15)
   );


 let structure =
   "RANGE";


 if(last >= high15*0.98)
   structure="HH";


 if(last <= low15*1.02)
   structure="LL";



 const cyclePosition =
   candles.length % 45;



 let score=50;


 if(
  dma21 &&
  last > dma21
 )
   score+=10;


 if(
  dma30 &&
  last > dma30
 )
   score+=10;


 if(rsiValue>60)
   score+=10;


 if(rsiValue<40)
   score-=10;


 if(macd>0)
   score+=10;


 if(macd<0)
   score-=10;



 let regime =
   "NEUTRAL";


 let phase =
   "CONSOLIDATION";


 if(score>=65){

  regime="BULLISH";

  phase="MARKUP";

 }


 if(score<=35){

  regime="BEARISH";

  phase="DISTRIBUTION";

 }



 let bias =
   "NEUTRAL";


 if(score>=65)
   bias="RISK_ON";


 if(score<=35)
   bias="RISK_OFF";



 return {

  regime,

  phase,

  structure,

  confidence:
    Math.min(
     Math.max(score,0),
     100
    ),

  institutionalBias:bias,


  confirmation:{

    adx:
      Number(
       adx.toFixed(2)
      ),

    trendStrength:
      adx>25
      ?"STRONG"
      :"WEAK",


    macd:

      macd>0
      ?"POSITIVE"
      :"NEGATIVE",


    rsi:

      Number(
       rsiValue.toFixed(2)
      ),


    cycle45:

      cyclePosition

  },


  indicators:{

    close:last,

    dma21:
      Number(
       dma21?.toFixed(2)
      ),

    dma30:
      Number(
       dma30?.toFixed(2)
      )

  }


 };

}
