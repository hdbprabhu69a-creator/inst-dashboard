import { SwingPoint } from "@/lib/pattern/types";

export type StructuralTrend = {
  support: SwingPoint[];
  resistance: SwingPoint[];
  activeSupport?: SwingPoint;
  activeResistance?: SwingPoint;
};

function unique(
  points: SwingPoint[]
): SwingPoint[] {

  return points.filter(
    (point,index,array)=>

      array.findIndex(
        p=>

          p.type===point.type &&

          Math.abs(
            p.price-point.price
          )<0.5

      )===index

  );

}

function higherLows(
  points: SwingPoint[]
): SwingPoint[]{

  const lows=

    points

      .filter(
        p=>p.type==="LOW"
      )

      .sort(
        (a,b)=>(a.index??0)-(b.index??0)
      );

  const chain:SwingPoint[]=[];

  for(const low of lows){

    if(

      chain.length===0 ||

      low.price>

      chain[
        chain.length-1
      ].price

    ){

      chain.push(low);

    }

  }

  return chain;

}

function lowerHighs(
  points: SwingPoint[]
): SwingPoint[]{

  const highs=

    points

      .filter(
        p=>p.type==="HIGH"
      )

      .sort(
        (a,b)=>(a.index??0)-(b.index??0)
      );

  const chain:SwingPoint[]=[];

  for(const high of highs){

    if(

      chain.length===0 ||

      high.price<

      chain[
        chain.length-1
      ].price

    ){

      chain.push(high);

    }

  }

  return chain;

}

export function buildStructuralChain(

  swings:SwingPoint[],

  structure:string

):StructuralTrend{

  const clean=

    unique(
      swings
    );

  const support =
  structure==="HH_HL"
    ? higherLows(clean)
    : [];

const resistance =
  structure==="LH_LL"
    ? lowerHighs(clean)
    : clean
        .filter(
          p=>p.type==="HIGH"
        )
        .sort(
          (a,b)=>(a.index??0)-(b.index??0)
        );

return {
  support,
  resistance,
  activeSupport: support.at(-1),
  activeResistance: resistance.at(-1),
};

}





export function buildSupportTrendline(
  trend:StructuralTrend
){

  if(
    trend.support.length<2
  ){
    return null;
  }

  return{

    start:
      trend.support[0],

    end:
      trend.support.at(-1)!

  };

}


export function buildResistanceTrendline(
  trend:StructuralTrend
){

  if(
    trend.resistance.length<2
  ){
    return null;
  }

  return{

    start:
      trend.resistance[0],

    end:
      trend.resistance.at(-1)!

  };

}


export function buildInstitutionalChannel(
  trend:StructuralTrend
){

  const support=
    buildSupportTrendline(trend);

  const resistance=
    buildResistanceTrendline(trend);

  if(
    !support ||
    !resistance
  ){
    return null;
  }

  const supportSlope=
    (support.end.price-support.start.price)/
    Math.max(
      1,
      (support.end.index??1)-(support.start.index??0)
    );

  const resistanceSlope=
    (resistance.end.price-resistance.start.price)/
    Math.max(
      1,
      (resistance.end.index??1)-(resistance.start.index??0)
    );

  const width=
    resistance.end.price-
    support.end.price;

  return{

    support,

    resistance,

    supportSlope,

    resistanceSlope,

    width,

    strength:
      trend.support.length+
      trend.resistance.length

  };

}

