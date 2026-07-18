import type { TradeRecord } from "../types";

const TIME=/^\d{2}:\d{2}:\d{2}$/;

const SIDE_EXCHANGE=/([BS])(NSE|BSE)$/;

export function parseTradeTable(
  text:string
):TradeRecord[]{

  const trades:TradeRecord[]=[];

  const normalized=text
    .replace(/\r/g,"")
    .replace(/\n+/g,"\n");

  const rows=normalized.split("\n");

  let i=0;

  while(i<rows.length){

    let row=rows[i].trim();

    if(!/^\d{10,}/.test(row)){
      i++;
      continue;
    }

    while(
      i+1<rows.length &&
      !/^\d{10,}/.test(rows[i+1])
    ){
      row+=rows[++i].trim();
    }

    const m=row.match(
      /^(\d+)(\d{2}:\d{2}:\d{2})(\d+)(\d{2}:\d{2}:\d{2})(.+)$/
    );

    if(!m){
      i++;
      continue;
    }

    const[
      ,
      orderNumber,
      orderTime,
      tradeNumber,
      tradeTime,
      tail
    ]=m;

    const sideMatch=tail.match(SIDE_EXCHANGE);

    if(!sideMatch){
      i++;
      continue;
    }

    const idx=sideMatch.index!;

    const security=tail.substring(0,idx);

    const side=
      sideMatch[1]==="B"
        ?"BUY"
        :"SELL";

    const exchange=sideMatch[2];

    const numeric=tail.substring(idx+sideMatch[0].length);

    const nums=numeric.match(
      /-?\d+(?:\.\d+)?/g
    )??[];

    if(nums.length<3){
      i++;
      continue;
    }

    const quantity=Number(nums[0]);

    const brokerage=
      nums.length===4
        ?Number(nums[1])
        :0;

    const price=
      nums.length===4
        ?Number(nums[2])
        :Number(nums[1]);

    const grossValue=Number(
      nums[nums.length-1]
    );

    const symbol=security
      .replace(/\/.*$/,"")
      .replace(/-EQ$/,"")
      .replace(/-BE$/,"")
      .replace(/-BL$/,"")
      .replace(/-SM$/,"")
      .trim();

    trades.push({

      tradeDate:"",

      tradeTime,

      exchange,

      segment:"EQ",

      symbol,

      series:"EQ",

      side,

      quantity,

      price,

      grossValue,

      orderNumber,

      tradeNumber

    });

    i++;

  }

  return trades;

}
