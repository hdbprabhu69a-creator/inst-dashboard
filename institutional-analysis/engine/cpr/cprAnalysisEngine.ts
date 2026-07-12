import { getCPRWidth } from "./widthEngine";
import { getCPRRelationship } from "./relationshipEngine";
import { getVirginCPR } from "./virginEngine";
import { getOpeningPosition } from "./openingEngine";
import { getCPRPosition } from "./positionEngine";
import { getCPRBreakout } from "./breakoutEngine";
import { getCPRDistance } from "./distanceEngine";
import { getCPRCompression } from "./compressionEngine";
import { getCPRAcceptance } from "./acceptanceEngine";
import { getCPRRejection } from "./rejectionEngine";
import { getCPRGap } from "./gapEngine";
import { getCPRProbability } from "./probabilityEngine";
import { getCPRBias } from "./biasEngine";
import { getCPRAlignment } from "./alignmentEngine";
import { getCPRScore } from "./scoreEngine";
import { getCPRVerdict } from "./verdictEngine";

export function analyzeCPR(data:any){

  const width=getCPRWidth(
    data.dailyCPR.bc,
    data.dailyCPR.tc,
    data.dailyOHLC.high,
    data.dailyOHLC.low
  );

  const relationship=getCPRRelationship(
    data.dailyCPR.bc,
    data.dailyCPR.tc,
    data.previousCPR?.bc ?? data.dailyCPR.bc,
    data.previousCPR?.tc ?? data.dailyCPR.tc
  );

  const virgin=getVirginCPR(
    data.dailyOHLC.high,
    data.dailyOHLC.low,
    data.dailyCPR.bc,
    data.dailyCPR.tc
  );

  const opening=getOpeningPosition(
    data.dailyOHLC.open,
    data.dailyCPR.bc,
    data.dailyCPR.pivot,
    data.dailyCPR.tc,
    data.dailyPivot.r1,
    data.dailyPivot.r2,
    data.dailyPivot.r3,
    data.dailyPivot.s1,
    data.dailyPivot.s2
  );

  const position=getCPRPosition(
    data.cmp,
    data.dailyCPR.bc,
    data.dailyCPR.tc,
    data.dailyCPR.pivot,
    data.dailyPivot.r1,
    data.dailyPivot.r2,
    data.dailyPivot.r3,
    data.dailyPivot.s1,
    data.dailyPivot.s2
  );

  const breakout=getCPRBreakout(
    data.dailyOHLC.open,
    data.dailyOHLC.high,
    data.dailyOHLC.low,
    data.cmp,
    data.dailyCPR.bc,
    data.dailyCPR.tc
  );

  const distance=getCPRDistance(
    data.cmp,
    data.dailyCPR.bc,
    data.dailyCPR.tc,
    data.dailyCPR.pivot,
    data.dailyPivot.r1,
    data.dailyPivot.r2,
    data.dailyPivot.r3,
    data.dailyPivot.s1,
    data.dailyPivot.s2,
    data.dailyPivot.s3
  );

  const compression=getCPRCompression(
    width.widthPct
  );

  const acceptance=getCPRAcceptance(
    data.dailyOHLC.open,
    data.cmp,
    data.dailyCPR.bc,
    data.dailyCPR.tc
  );

  const rejection=getCPRRejection(
    data.dailyOHLC.open,
    data.dailyOHLC.high,
    data.dailyOHLC.low,
    data.cmp,
    data.dailyCPR.bc,
    data.dailyCPR.tc
  );

  const gap=getCPRGap(
    data.previousClose ?? data.dailyOHLC.close,
    data.dailyOHLC.open,
    data.dailyCPR.bc,
    data.dailyCPR.tc,
    data.dailyPivot.r1,
    data.dailyPivot.s1
  );

  const probability=getCPRProbability(
    width.widthPct,
    compression.score,
    breakout.bullish
  );

  const bias=getCPRBias(
    relationship,
    position,
    breakout.bullish,
    breakout.bearish,
    acceptance.state==="ACCEPTED_ABOVE",
    acceptance.state==="ACCEPTED_BELOW"
  );

  const alignment=getCPRAlignment(
    bias.bias,
    data.pivot?.bias ?? "NEUTRAL",
    data.pivot?.bias ?? "NEUTRAL"
  );

  const score=getCPRScore({
    widthScore:Math.max(0,100-width.widthPct),
    compressionScore:compression.score,
    probabilityScore:probability.breakout,
    biasScore:bias.score,
    alignmentScore:alignment.score,
    acceptanceScore:acceptance.score,
    rejectionScore:100-rejection.score
  });

  return{

    width,
    relationship,
    virgin,
    opening,
    position,
    breakout,
    distance,
    compression,
    acceptance,
    rejection,
    gap,
    probability,
    bias,
    alignment,

    score,
    verdict:getCPRVerdict(score),

    evidence:[
      width.widthClass,
      relationship,
      opening,
      position,
      breakout.state,
      probability.verdict
    ],

    updatedAt:new Date().toISOString()

  };

}

