import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class MarkUpRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"MARK_UP",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.deliveryGrowth??0)>0 &&
      (m.deliveryMomentum??0)>0 &&
      (m.dailyDeliveryPercent??0)>=50 &&
      (m.rolling[20].zScore??-99)>0;

    return{
      detector:"MARK_UP",
      detected,
      configured:true,
      rationale:detected
        ?"Mark-up phase detected."
        :"Mark-up criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore
      }
    };

  }

}
