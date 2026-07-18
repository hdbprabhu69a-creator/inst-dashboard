import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class SmartMoneyEntryRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"SMART_MONEY_ENTRY",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.dailyDeliveryPercent??0)>=60 &&
      (m.deliveryGrowth??0)>0 &&
      (m.deliveryMomentum??0)>0 &&
      (m.historicalPercentile??0)>=0.80 &&
      (m.rolling[20].zScore??-99)>1;

    return{
      detector:"SMART_MONEY_ENTRY",
      detected,
      configured:true,
      rationale:detected
        ?"Smart money entry detected."
        :"Smart money entry criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        percentile:m.historicalPercentile,
        zScore20:m.rolling[20].zScore
      }
    };

  }

}
