import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class SmartMoneyExitRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"SMART_MONEY_EXIT",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.dailyDeliveryPercent??100)<=40 &&
      (m.deliveryGrowth??0)<0 &&
      (m.deliveryMomentum??0)<0 &&
      (m.historicalPercentile??1)<=0.20 &&
      (m.rolling[20].zScore??99)<-1;

    return{
      detector:"SMART_MONEY_EXIT",
      detected,
      configured:true,
      rationale:detected
        ?"Smart money exit detected."
        :"Smart money exit criteria not satisfied.",
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

