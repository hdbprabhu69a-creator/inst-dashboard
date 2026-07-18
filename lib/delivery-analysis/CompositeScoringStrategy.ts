import type {
  AnalysisResult,
  ScoreResult,
  ScoringStrategy
} from "./DeliveryTypes";

export class CompositeScoringStrategy
implements ScoringStrategy {

  readonly name="composite" as const;

  score(
    result: Omit<
      AnalysisResult,
      "scores"|
      "signals"|
      "trend"|
      "confidence"|
      "detectorResults"
    >
  ): ScoreResult {

    const m=result.latestMetrics;

    if(!m){
      return{
        name:this.name,
        value:null,
        configured:true,
        rationale:"No metrics available."
      };
    }

    let score=0;

    score+=(m.dailyDeliveryPercent??0)*0.25;
    score+=Math.max(0,(m.historicalPercentile??0)*100)*0.20;
    score+=Math.max(0,(m.deliveryGrowth??0)*100)*0.15;
    score+=Math.max(0,(m.deliveryMomentum??0)*100)*0.10;
    score+=Math.max(0,(m.deliveryAcceleration??0)*100)*0.10;

    if((m.dailyDeliveryPercent??0)>=60) score+=10;
    if((m.historicalPercentile??0)>=0.80) score+=5;
    if((m.rolling[20].zScore??0)>=1) score+=5;

    score=Math.max(0,Math.min(100,score));

    return{
      name:this.name,
      value:Number(score.toFixed(2)),
      configured:true,
      rationale:"Composite score derived from delivery metrics and statistical strength."
    };

  }

}
