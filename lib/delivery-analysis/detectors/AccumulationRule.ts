import type {
  DetectorContext,
  DetectorResult,
  DetectorRule
} from "../DeliveryTypes";

export class AccumulationRule
implements DetectorRule {

  evaluate(
    context: DetectorContext
  ): DetectorResult {

    const m = context.latestMetrics;

    if (!m) {

      return {
        detector:"ACCUMULATION",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };

    }

    const detected =
      (m.dailyDeliveryPercent ?? 0) >= 55 &&
      (m.deliveryGrowth ?? 0) > 0 &&
      (m.deliveryMomentum ?? 0) > 0 &&
      (m.rolling[20].zScore ?? -99) > 0 &&
      (m.historicalPercentile ?? 0) >= 0.70;

    return {

      detector:"ACCUMULATION",

      detected,

      configured:true,

      rationale:
        detected
        ? "Institutional accumulation detected."
        : "Accumulation criteria not satisfied.",

      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore,
        percentile:m.historicalPercentile
      }

    };

  }

}

