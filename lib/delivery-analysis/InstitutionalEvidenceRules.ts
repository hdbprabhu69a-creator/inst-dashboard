import type { InstitutionalAccumulationResult } from "./InstitutionalAccumulationEngine";
import type { DeliveryPersistenceResult } from "./DeliveryPersistenceEngine";
import type { DeliveryQualityResult } from "./DeliveryQualityEngine";
import type { InstitutionalEvidenceCategory, InstitutionalEvidenceEvaluation, InstitutionalEvidenceInput, InstitutionalEvidenceRule } from "./InstitutionalEvidenceTypes";

/** Supported explicit numeric comparisons for configured evidence rules. */
export type EvidenceComparison = "GREATER_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN" | "LESS_THAN_OR_EQUAL" | "EQUAL";
/** Complete configuration required by every evidence rule. No threshold has a default. */
export interface EvidenceRuleConfiguration { readonly id: string; readonly name: string; readonly expectedValue: number; readonly comparison: EvidenceComparison; readonly weight: number; }

/** Base class for configured comparisons over already-computed numeric outputs. */
export abstract class ConfiguredEvidenceRule implements InstitutionalEvidenceRule {
  abstract readonly category: InstitutionalEvidenceCategory;
  readonly id: string; readonly name: string; readonly expectedValue: number; readonly weight: number;
  constructor(private readonly configuration: EvidenceRuleConfiguration) {
    if (!configuration.id.trim() || !configuration.name.trim() || !Number.isFinite(configuration.expectedValue) || !Number.isFinite(configuration.weight) || configuration.weight < 0) throw new Error("Evidence rules require an id, name, finite expected value, and non-negative weight.");
    this.id = configuration.id; this.name = configuration.name; this.expectedValue = configuration.expectedValue; this.weight = configuration.weight;
  }
  evaluate(input: InstitutionalEvidenceInput): InstitutionalEvidenceEvaluation {
    const currentValue = this.selectValue(input);
    if (currentValue === undefined || !Number.isFinite(currentValue)) return { status: "UNKNOWN", currentValue: Number.NaN, reason: `${this.name}: source metric is unavailable.` };
    const passed = this.compare(currentValue, this.expectedValue);
    return { status: passed ? "PASS" : "FAIL", currentValue, reason: `${this.name}: ${currentValue} ${this.comparisonText()} ${this.expectedValue}.` };
  }
  protected abstract selectValue(input: InstitutionalEvidenceInput): number | undefined;
  private compare(value: number, expected: number): boolean { switch (this.configuration.comparison) { case "GREATER_THAN": return value > expected; case "GREATER_THAN_OR_EQUAL": return value >= expected; case "LESS_THAN": return value < expected; case "LESS_THAN_OR_EQUAL": return value <= expected; case "EQUAL": return value === expected; } }
  private comparisonText(): string { switch (this.configuration.comparison) { case "GREATER_THAN": return ">"; case "GREATER_THAN_OR_EQUAL": return ">="; case "LESS_THAN": return "<"; case "LESS_THAN_OR_EQUAL": return "<="; case "EQUAL": return "="; } }
}

/** Configurable evidence rule over one persistence-engine metric. */
export class PersistenceRule extends ConfiguredEvidenceRule {
  readonly category = "DELIVERY" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: keyof DeliveryPersistenceResult) { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return input.persistence?.[this.metric]; }
}

/** Configurable evidence rule over one delivery-quality metric. */
export class QualityRule extends ConfiguredEvidenceRule {
  readonly category = "QUALITY" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: keyof DeliveryQualityResult) { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return input.quality?.[this.metric]; }
}

/** Configurable evidence rule over a volume confirmation quality metric. */
export class VolumeRule extends ConfiguredEvidenceRule {
  readonly category = "VOLUME" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: "relativeVolume" | "volumeExpansion" | "volumeQualityIndex") { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return input.quality?.[this.metric]; }
}

/** Configurable evidence rule over a price confirmation quality metric. */
export class PriceRule extends ConfiguredEvidenceRule {
  readonly category = "PRICE" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: "priceEfficiency" | "priceAcceptance" | "deliveryPriceAlignment") { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return input.quality?.[this.metric]; }
}

/** Configurable evidence rule over an exposed accumulation trend component. */
export class TrendRule extends ConfiguredEvidenceRule {
  readonly category = "TREND" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: "trendStrength" | "persistenceTrend" | "qualityTrend" | "volumeTrend") { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return this.metric === "trendStrength" ? input.accumulation?.trendStrength : input.accumulation?.breakdown?.[this.metric]; }
}

/** Configurable evidence rule over one exposed accumulation-engine value. */
export class AccumulationRule extends ConfiguredEvidenceRule {
  readonly category = "ACCUMULATION" as const;
  constructor(configuration: EvidenceRuleConfiguration, private readonly metric: "accumulationScore" | "deliveryStrength" | "volumeStrength" | "priceStrength" | "confidence") { super(configuration); }
  protected selectValue(input: InstitutionalEvidenceInput): number | undefined { return input.accumulation?.[this.metric]; }
}

