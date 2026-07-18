import type { EquitySummary } from "../types";

export function parseEquitySummary(
  text:string
):EquitySummary[]{

  const instruments:EquitySummary[]=[];

  const regex=/INE[A-Z0-9]{9,}[A-Z]+/g;

  const matches=[...text.matchAll(regex)];

  for(let i=0;i<matches.length;i++){

    const start=matches[i].index!;

    const end=
      i+1<matches.length
        ?matches[i+1].index!
        :text.indexOf("NET TOTAL",start);

    const block=text.substring(
      start,
      end>start?end:text.length
    );

    const isin=block.substring(0,12);

    const rest=block.substring(12);

    const symbolMatch=rest.match(/^[A-Z]+/);

    if(!symbolMatch){
      continue;
    }

    const symbol=symbolMatch[0];

    const numbers=
      block.match(/\d+\.\d+|\d+/g) ?? [];

    if(numbers.length<8){
      continue;
    }

    instruments.push({

      isin,

      symbol,

      buyQuantity:Number(numbers[0]),

      buyAveragePrice:Number(numbers[1]),


      buyValue:Number(numbers[4]),

      sellQuantity:Number(numbers[5]),

      sellAveragePrice:Number(numbers[6]),

      sellValue:Number(numbers[9] ?? 0),

      netQuantity:Number(numbers[numbers.length-2]),

      netObligation:Number(numbers[numbers.length-1])

    });

  }

  return instruments;

}

