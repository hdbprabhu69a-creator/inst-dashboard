import type { InstitutionalAccumulationResult } from "./InstitutionalAccumulationEngine";
import type { DeliveryPersistenceResult } from "./DeliveryPersistenceEngine";
import type { DeliveryQualityResult } from "./DeliveryQualityEngine";

/** Evidence groups represented by the institutional evidence engine. */
export type InstitutionalEvidenceCategory = "DELIVERY" | "QUALITY" | "VOLUME" | "PRICE" | "TREND" | "ACCUMULATION";
/** The three explicit outcomes supported by every evidence rule. */
export type InstitutionalEvidenceStatus = "PASS" | "FAIL" | "UNKNOWN";

/** A complete, explainable result for one configured institutional-evidence rule. */
export interface InstitutionalEvidence {
  readonly id: string;
  readonly name: string;
  readonly category: InstitutionalEvidenceCategory;
  readonly passed: boolean;
  /** 100 when the rule had a finite input; 0 when its input was unavailable. */
  readonly confidence: number;
  readonly reason: string;
  /** NaN denotes an unavailable source value, preserving the numeric evidence contract. */
  readonly currentValue: number;
  readonly expectedValue: number;
  readonly weight: number;
}

/** Aggregate evidence counts and completeness-only confidence. */
export interface InstitutionalEvidenceResult {
  readonly evidence: readonly InstitutionalEvidence[];
  readonly passed: number;
  readonly failed: number;
  readonly total: number;
  readonly confidence: number;
}

/** Existing-engine outputs consumed without recalculation by evidence rules. */
export interface InstitutionalEvidenceInput {
  readonly persistence?: Partial<DeliveryPersistenceResult> | null;
  readonly quality?: Partial<DeliveryQualityResult> | null;
  readonly accumulation?: Partial<InstitutionalAccumulationResult> | null;
}

/** Raw outcome returned by a rule before the engine creates a public evidence item. */
export interface InstitutionalEvidenceEvaluation {
  readonly status: InstitutionalEvidenceStatus;
  readonly currentValue: number;
  readonly reason: string;
}

/** Configurable rule contract; rules never calculate source-engine metrics. */
export interface InstitutionalEvidenceRule {
  readonly id: string;
  readonly name: string;
  readonly category: InstitutionalEvidenceCategory;
  readonly expectedValue: number;
  readonly weight: number;
  evaluate(input: InstitutionalEvidenceInput): InstitutionalEvidenceEvaluation;
}
