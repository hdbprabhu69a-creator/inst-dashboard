import type { InstitutionalEvidenceCategory, InstitutionalEvidenceResult, InstitutionalEvidenceStatus } from "./InstitutionalEvidenceTypes";

/** Institutional behavioural states derived exclusively from configured evidence combinations. */
export type InstitutionalBehaviour = "UNKNOWN" | "BUILDING" | "STRENGTHENING" | "ACTIVE" | "WEAKENING" | "DISTRIBUTING" | "EXITING";

/** Required status for an evidence group within a configured behaviour rule. */
export interface BehaviourEvidenceRequirement {
  readonly category: InstitutionalEvidenceCategory;
  readonly status: InstitutionalEvidenceStatus;
  /** Whether one matching item is enough or every available item in the category must match. */
  readonly match: "ANY" | "ALL";
}

/** Explainable evaluation of one rule against an evidence result. */
export interface BehaviourEvaluation {
  readonly ruleId: string;
  readonly behaviour: InstitutionalBehaviour;
  readonly matched: boolean;
  /** Percentage of rule requirements with available evidence, independent of their PASS/FAIL state. */
  readonly completeness: number;
  readonly reason: string;
  readonly satisfiedEvidence: readonly string[];
  readonly missingEvidence: readonly string[];
}

/** Rule contract for converting only evidence-group outcomes into behavioural state. */
export interface BehaviourRule {
  readonly id: string;
  readonly behaviour: InstitutionalBehaviour;
  evaluate(evidence: InstitutionalEvidenceResult): BehaviourEvaluation;
}

/** Ordered behaviour rule set; earlier matching rules take precedence explicitly. */
export interface BehaviourConfiguration { readonly rules: readonly BehaviourRule[]; }

/** Public behavioural state and its fully explainable rule/evidence provenance. */
export interface BehaviourResult {
  readonly behaviour: InstitutionalBehaviour;
  readonly reason: string;
  readonly satisfiedEvidence: readonly string[];
  readonly missingEvidence: readonly string[];
  /** Completeness-only confidence from evidence completeness and selected-rule completeness. */
  readonly confidence: number;
  readonly ruleId: string | null;
}

