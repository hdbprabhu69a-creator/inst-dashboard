import type {
  DetectorContext,
  DetectorResult,
  DetectorRule
} from "../DeliveryTypes";

export class DistributionRule
implements DetectorRule {

  evaluate(
    context: DetectorContext
  ): DetectorResult {

    const m = context.latestMetrics;

    if (!m) {

      return {
        detector:"DISTRIBUTION",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };

    }

    const detected =
      (m.dailyDeliveryPercent ?? 100) <= 40 &&
      (m.deliveryGrowth ?? 0) < 0 &&
      (m.deliveryMomentum ?? 0) < 0 &&
      (m.rolling[20].zScore ?? 99) < 0 &&
      (m.historicalPercentile ?? 1) <= 0.30;

    return {

      detector:"DISTRIBUTION",

      detected,

      configured:true,

      rationale:
        detected
        ? "Institutional distribution detected."
        : "Distribution criteria not satisfied.",

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

