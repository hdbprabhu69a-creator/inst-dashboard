import type {
  AnalysisResult,
  ScoreResult,
  ScoringStrategy
} from "./DeliveryTypes";

export class TrendScoringStrategy
implements ScoringStrategy {

  readonly name="trend" as const;

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

    let score=50;

    if((m.deliveryGrowth??0)>0) score+=15;
    if((m.deliveryMomentum??0)>0) score+=15;
    if((m.deliveryAcceleration??0)>0) score+=10;
    if((m.dailyDeliveryPercent??0)>=50) score+=10;

    score=Math.max(0,Math.min(100,score));

    return{
      name:this.name,
      value:score,
      configured:true,
      rationale:"Trend score derived from delivery trend metrics."
    };

  }

}

