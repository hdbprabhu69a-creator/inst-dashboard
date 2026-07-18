import type { InstitutionalEvidence, InstitutionalEvidenceResult } from "./InstitutionalEvidenceTypes";
import type { BehaviourConfiguration, BehaviourEvaluation, BehaviourEvidenceRequirement, BehaviourResult, BehaviourRule, InstitutionalBehaviour } from "./InstitutionalBehaviourTypes";

/** Immutable configuration for one evidence-group behaviour rule. */
export interface ConfiguredBehaviourRuleDefinition {
  readonly id: string;
  readonly behaviour: InstitutionalBehaviour;
  readonly reason: string;
  readonly requirements: readonly BehaviourEvidenceRequirement[];
}

/**
 * Declarative implementation of a behaviour rule over evidence groups only.
 *
 * A requirement is available when its category contains at least one complete
 * evidence item. `ANY` requires one item with the configured status; `ALL`
 * requires all complete category items to have that status. Unknown items never
 * satisfy a requirement but are reported as missing evidence.
 */
export class ConfiguredBehaviourRule implements BehaviourRule {
  readonly id: string; readonly behaviour: InstitutionalBehaviour;
  constructor(private readonly definition: ConfiguredBehaviourRuleDefinition) {
    if (!definition.id.trim() || !definition.reason.trim() || definition.requirements.length === 0) throw new Error("Behaviour rules require an id, reason, and at least one evidence requirement.");
    this.id = definition.id; this.behaviour = definition.behaviour;
  }
  /** Evaluates only category/status requirements against existing evidence items. */
  evaluate(result: InstitutionalEvidenceResult): BehaviourEvaluation {
    const satisfiedEvidence: string[] = []; const missingEvidence: string[] = []; let availableRequirements = 0; let matched = true;
    for (const requirement of this.definition.requirements) {
      const evidence = result.evidence.filter((item) => item.category === requirement.category);
      const completeEvidence = evidence.filter((item) => this.status(item) !== "UNKNOWN");
      if (completeEvidence.length > 0) availableRequirements++;
      const matchingEvidence = completeEvidence.filter((item) => this.status(item) === requirement.status);
      const requirementMatches = requirement.match === "ANY" ? matchingEvidence.length > 0 : completeEvidence.length > 0 && matchingEvidence.length === completeEvidence.length;
      if (requirementMatches) satisfiedEvidence.push(...matchingEvidence.map((item) => item.id));
      else { matched = false; missingEvidence.push(...this.unmetNames(requirement.category, requirement.status, completeEvidence, evidence)); }
    }
    return { ruleId: this.id, behaviour: this.behaviour, matched, completeness: availableRequirements / this.definition.requirements.length * 100, reason: this.definition.reason, satisfiedEvidence: [...new Set(satisfiedEvidence)], missingEvidence: [...new Set(missingEvidence)] };
  }
  private status(evidence: InstitutionalEvidence): "PASS" | "FAIL" | "UNKNOWN" { return !Number.isFinite(evidence.currentValue) ? "UNKNOWN" : evidence.passed ? "PASS" : "FAIL"; }
  private unmetNames(category: BehaviourEvidenceRequirement["category"], status: BehaviourEvidenceRequirement["status"], complete: readonly InstitutionalEvidence[], all: readonly InstitutionalEvidence[]): string[] { if (all.length === 0) return [`${category}:${status}`]; if (complete.length === 0) return all.map((item) => item.id); return complete.filter((item) => this.status(item) !== status).map((item) => item.id); }
}

/**
 * Converts existing evidence into a configured behavioural state without inspecting
 * source metrics. Rule ordering is the declared precedence mechanism: the first
 * matching rule is returned. If none matches, `UNKNOWN` is returned.
 */
export class InstitutionalBehaviourEngine {
  /** Creates the engine with an explicit ordered rule configuration and no implicit behaviour rules. */
  constructor(private readonly configuration: BehaviourConfiguration) {}
  /** Evaluates configured behaviour rules against an evidence result. */
  evaluate(evidence: InstitutionalEvidenceResult): BehaviourResult {
    const evaluations = this.configuration.rules.map((rule) => rule.evaluate(evidence));
    const selected = evaluations.find((evaluation) => evaluation.matched);
    if (selected) return this.toResult(selected, evidence.confidence);
    const mostComplete = evaluations.reduce<BehaviourEvaluation | null>((best, evaluation) => !best || evaluation.completeness > best.completeness ? evaluation : best, null);
    return { behaviour: "UNKNOWN", reason: mostComplete ? `No configured rule matched. ${mostComplete.reason}` : "No behaviour rules are configured.", satisfiedEvidence: mostComplete?.satisfiedEvidence ?? [], missingEvidence: mostComplete?.missingEvidence ?? [], confidence: mostComplete ? evidence.confidence * mostComplete.completeness / 100 : 0, ruleId: null };
  }
  private toResult(evaluation: BehaviourEvaluation, evidenceConfidence: number): BehaviourResult { return { behaviour: evaluation.behaviour, reason: evaluation.reason, satisfiedEvidence: evaluation.satisfiedEvidence, missingEvidence: evaluation.missingEvidence, confidence: evidenceConfidence * evaluation.completeness / 100, ruleId: evaluation.ruleId }; }
}
