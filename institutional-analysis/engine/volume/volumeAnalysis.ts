import { VolumeAnalysisResult } from "./volumeTypes";

export function volumeAnalysis(records:any[]):VolumeAnalysisResult{

  if(records.length<20){
    throw new Error("Insufficient history.");
  }

  const current=records.at(-1)!;

const deliveryRecords=records.filter(
  r=>Number(r.deliveryPercent??0)>0
);

const deliveryCurrent=
  deliveryRecords.length>0
    ?deliveryRecords.at(-1)!
    :current;

  const average=(days:number,field:string)=>{

    const rows=records.slice(-Math.min(days,records.length));

    return rows.reduce(
      (s,r)=>s+Number(r[field]??0),
      0
    )/rows.length;

  };

  const sma=(days:number)=>{

    const rows=records.slice(-Math.min(days,records.length));

    return rows.reduce(
      (s,r)=>s+Number(r.close),
      0
    )/rows.length;

  };

  const sma20=sma(20);
  const sma50=sma(50);
  const sma100=sma(100);
  const sma200=sma(200);

  const currentVolume=Number(current.volume);

  const volumeAverage=(days:number)=>{

    const rows=records.slice(-Math.min(days,records.length));

    return rows.reduce((s,r)=>s+Number(r.volume),0)/rows.length;

  };

  const avgVolume5=volumeAverage(5);
  const avgVolume20=volumeAverage(20);
  const avgVolume50=volumeAverage(50);

  const relativeVolume=currentVolume/avgVolume20;

  const deliveryAverage=(days:number)=>{

    if(deliveryRecords.length===0) return 0;

    const rows=deliveryRecords.slice(-Math.min(days,deliveryRecords.length));

    return rows.reduce((s,r)=>s+Number(r.deliveryPercent),0)/rows.length;

  };

  const avgDelivery5=deliveryAverage(5);
  const avgDelivery10=deliveryAverage(10);
  const avgDelivery20=deliveryAverage(20);

  const volumeTrend=
    relativeVolume>1.20
      ?"Increasing"
      :relativeVolume<0.80
      ?"Decreasing"
      :"Neutral";

  const participation=
    deliveryCurrent.deliveryPercent>=60
      ?"Institutional"
      :deliveryCurrent.deliveryPercent>=45
      ?"Mixed"
      :"Retail";

  const above20=current.close>sma20;
  const above50=current.close>sma50;
  const above100=current.close>sma100;
  const above200=current.close>sma200;

  const bullAlignment=
    sma20>sma50 &&
    sma50>sma100 &&
    sma100>sma200;

  const bearAlignment=
    sma20<sma50 &&
    sma50<sma100 &&
    sma100<sma200;

  let accumulationDistribution="Neutral";

  if(
    current.close>current.open &&
    deliveryCurrent.deliveryPercent>avgDelivery20 &&
    relativeVolume>1 &&
    above200
  ){
    accumulationDistribution="Accumulation";
  }

  if(
    current.close<current.open &&
    deliveryCurrent.deliveryPercent>avgDelivery20 &&
    relativeVolume>1 &&
    !above200
  ){
    accumulationDistribution="Distribution";
  }

  const priceVolumeConfirmation=
    current.close>current.open &&
    relativeVolume>1
      ?"Bullish"
      :current.close<current.open &&
       relativeVolume>1
      ?"Bearish"
      :"Neutral";

  const breakoutConfirmation=
    current.close>=Math.max(...records.slice(-20).map(r=>r.high)) &&
    relativeVolume>1.5
      ?"Confirmed"
      :"No";

  const breakdownConfirmation=
    current.close<=Math.min(...records.slice(-20).map(r=>r.low)) &&
    relativeVolume>1.5
      ?"Confirmed"
      :"No";

  const buyingSellingClimax=
    relativeVolume>=2
      ?current.close>current.open
        ?"Buying Climax"
        :"Selling Climax"
      :"None";

  const dryVolume=relativeVolume<0.60;

  let volumeScore=50;

  let deliveryScore=50;

  if(above20) volumeScore+=2;
  if(above50) volumeScore+=3;
  if(above100) volumeScore+=5;
  if(above200) volumeScore+=10;

  if(bullAlignment) volumeScore+=10;
  if(bearAlignment) volumeScore-=10;

  if(relativeVolume>1) volumeScore+=10;
  if(relativeVolume>1.5) volumeScore+=10;

  if(deliveryCurrent.deliveryPercent>avgDelivery20) volumeScore+=10;

  if(accumulationDistribution==="Accumulation") volumeScore+=15;
  if(accumulationDistribution==="Distribution") volumeScore-=15;

  if(breakoutConfirmation==="Confirmed") volumeScore+=10;
  if(breakdownConfirmation==="Confirmed") volumeScore-=10;

  if(dryVolume) volumeScore-=10;

  volumeScore=Math.max(0,Math.min(100,volumeScore));

  if(deliveryCurrent.deliveryPercent>=60) deliveryScore+=20;
  else if(deliveryCurrent.deliveryPercent>=45) deliveryScore+=10;

  if(deliveryCurrent.deliveryPercent>avgDelivery20) deliveryScore+=10;
  else if(deliveryCurrent.deliveryPercent<avgDelivery20) deliveryScore-=10;

  deliveryScore=Math.max(0,Math.min(100,deliveryScore));

  const institutionalScore=Math.round((volumeScore+deliveryScore)/2);

  const institutionalVerdict=
    volumeScore>=85
      ?"Strong Institutional Buying"
    :volumeScore>=70
      ?"Institutional Accumulation"
    :volumeScore>=55
      ?"Neutral"
      :"Institutional Distribution";

  return{

    currentVolume,

    avgVolume5,

    avgVolume20,
    avgVolume50,


    avgDelivery5,
    avgDelivery10,
    avgDelivery20,

    relativeVolume,
    

    volumeTrend,

    participation,

    accumulationDistribution,

    priceVolumeConfirmation,

    breakoutConfirmation,

    breakdownConfirmation,

    buyingSellingClimax,

    dryVolume,

    volumeScore,
    deliveryScore,
    institutionalScore,

    institutionalVerdict,

    sma20,
    sma50,
    sma100,
    sma200,

    above20,
    above50,
    above100,
    above200,

    bullAlignment,
    bearAlignment

  };

}













