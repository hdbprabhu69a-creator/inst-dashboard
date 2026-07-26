import {
  analyzeIndexRegime,
} from "@/lib/institutional/indexRegimeEngine";

import {
  detectMarketState,
} from "@/lib/marketState/stateEngine";

import {
  analyzeTrend,
} from "@/institutional-analysis/engine/priceStructure/analyzeTrend";

import {
  baseTargetEngine,
} from "@/institutional-analysis/engine/priceStructure/baseTargetEngine";

export function analyzeIndex(
  history:any[],
  liveCmp:number,
  marketStructure:any
){

  const regime =
    analyzeIndexRegime(
      history,
      liveCmp
    );

  const trend =
    analyzeTrend(
      history
    );


  const marketState =
    detectMarketState(

      history.map(candle=>({

        date:String(candle.time),

        open:candle.open,

        high:candle.high,

        low:candle.low,

        close:candle.close,

        volume:candle.volume

      }))

    );


  const finalTrend = {

    trend:

      trend.structure==="HH_HL"
      &&
      regime.regime==="BULLISH"

        ? "CONFIRMED_UPTREND"

      :

      trend.structure==="LH_LL"
      &&
      regime.regime==="BEARISH"

        ? "CONFIRMED_DOWNTREND"

      :

      trend.structure==="HH_HL"

        ? "UPTREND"

      :

      trend.structure==="LH_LL"

        ? "DOWNTREND"

      :

        "SIDEWAYS",


    structure:
      trend.structure,


    phase:
      trend.phase,


    strength:
      trend.strength,


    confidence:
      trend.confidence,


    regime:
      regime.regime,


    confirmation:
      regime.confirmation,


    indicators:
      regime.indicators

  };


  const baseTarget =
    baseTargetEngine({

      cmp:liveCmp,

      swing:
        marketStructure

    });


  return {

    cmp:liveCmp,

    trend:finalTrend,

    marketState,

    baseTarget

  };

}









