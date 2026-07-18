import type {
  DeliveryMetricsSnapshot,
  TrendResult,
  TrendStrategy
} from "./DeliveryTypes";

/** Default institutional trend classifier. */
export class DeliveryTrend {

  classify(
    metrics: DeliveryMetricsSnapshot | null,
    strategy?: TrendStrategy
  ): TrendResult {

    if (strategy) {
      return strategy.classify(metrics);
    }

    if (!metrics) {
      return {
        classification: "NEUTRAL",
        configured: true,
        rationale: "No metrics available."
      };
    }

    const pct = metrics.dailyDeliveryPercent ?? 0;
    const growth = metrics.deliveryGrowth ?? 0;
    const momentum = metrics.deliveryMomentum ?? 0;
    const accel = metrics.deliveryAcceleration ?? 0;
    const percentile = metrics.historicalPercentile ?? 0;

    if (
      pct >= 70 &&
      growth > 0 &&
      momentum > 0 &&
      accel > 0 &&
      percentile >= 90
    ) {
      return {
        classification: "INSTITUTIONAL",
        configured: true,
        rationale: "Exceptional institutional accumulation."
      };
    }

    if (
      pct >= 60 &&
      growth > 0 &&
      momentum > 0 &&
      percentile >= 75
    ) {
      return {
        classification: "VERY_STRONG",
        configured: true,
        rationale: "Strong institutional participation."
      };
    }

    if (
      pct >= 50 &&
      growth > 0
    ) {
      return {
        classification: "STRONG",
        configured: true,
        rationale: "Healthy delivery trend."
      };
    }

    if (
      pct >= 45
    ) {
      return {
        classification: "NEUTRAL",
        configured: true,
        rationale: "Balanced delivery behaviour."
      };
    }

    if (
      pct >= 35
    ) {
      return {
        classification: "WEAK",
        configured: true,
        rationale: "Below-average institutional activity."
      };
    }

    return {
      classification: "VERY_WEAK",
      configured: true,
      rationale: "Weak delivery participation."
    };

  }

}
