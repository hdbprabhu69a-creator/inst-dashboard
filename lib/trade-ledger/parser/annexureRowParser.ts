export interface ParsedAnnexureRow{

  orderNo:string;
  orderTime:string;
  tradeNo:string;
  tradeTime:string;
  symbol:string;
  isin:string;
  side:"B"|"S";
  exchange:"NSE"|"BSE";
  quantity:number;
  brokerage:number;
  price:number;
  total:number;

}

export function parseAnnexureRow(
  line:string
):ParsedAnnexureRow|null{

  const match=line.match(
    /^(\d{16})\s+(\d{2}:\d{2}:\d{2})\s+(\d{8,9})\s+(\d{2}:\d{2}:\d{2})\s+([A-Z0-9-]+)\s*\/\s*(INE[A-Z0-9]{9})\s+([BS])\s+(NSE|BSE)\s+(.+)$/
  );

  if(!match){

    return null;

  }

  const[
    ,
    orderNo,
    orderTime,
    tradeNo,
    tradeTime,
    symbol,
    isin,
    side,
    exchange,
    tail
  ]=match;

  const parts=tail.trim().split(/\s+/);

  console.log(parts);

  if(parts.length<3){

    return null;

  }

  return{

    orderNo,
    orderTime,
    tradeNo,
    tradeTime,
    symbol,
    isin,
    side:side as "B"|"S",
    exchange:exchange as "NSE"|"BSE",

    quantity:NaN,
    brokerage:NaN,
    price:Number(parts[1].replace(/[(),]/g,"")),
    total:Number(parts[2].replace(/[(),]/g,""))

  };

}

