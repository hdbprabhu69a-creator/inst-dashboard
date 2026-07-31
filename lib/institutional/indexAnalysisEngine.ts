import {
  buildInstitutionalTrendline,
} from "@/lib/institutional/institutionalTrendlineEngine";

import {
  getInstitutionalTrendlineStatus,
} from "@/lib/institutional/institutionalTrendlineStatus";

import {
  buildInstitutionalChannel,
} from "@/lib/institutional/institutionalChannelEngine";

import {
  getInstitutionalChannelStatus,
} from "@/lib/institutional/institutionalChannelStatus";
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

  };const rawTrendline =
  buildInstitutionalTrendline(
    marketStructure,
    trend.structure
  );

console.log("================================");
console.log("RAW TRENDLINE");
console.log(rawTrendline);
console.log("================================");



const channel =
  buildInstitutionalChannel(
    marketStructure,
    trend.structure
  );

const trendlineInfo =
  rawTrendline
    ? getInstitutionalTrendlineStatus(
        liveCmp,
        rawTrendline
      )
    : null;

const channelInfo =
  channel
    ? getInstitutionalChannelStatus(
        liveCmp,
        channel
      )
    : null;
const baseTarget =
    baseTargetEngine({

      cmp:liveCmp,

      swing:
        marketStructure

    });


  return {

  cmp: liveCmp,

  trend: finalTrend,

  marketState,

  trendline: trendlineInfo,

  channel: channelInfo,

  baseTarget

};
}







































