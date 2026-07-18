# Institutional Delivery Analysis Engine

This is a pure TypeScript framework for analysing historical NSE delivery records. It normalizes input, computes descriptive rolling metrics in a single pass over records (apart from bounded rolling-window slices), and delegates institutional interpretation to configured strategies and detector rules.

No default thresholds, signal rules, score weights, price-impact assumptions, or institutional-behaviour formulas are present. Until those policies are supplied, scores are explicitly unconfigured, the trend is `NEUTRAL`, and the signal is `NEUTRAL`.

## Extension points

- `DeliveryMetricStrategy`: persistence, stability, relative-volume, volume-expansion, price-efficiency, and price-vs-delivery measures.
- `ScoringStrategy`: composite, institutional, trend, and confidence scores.
- `TrendStrategy` / `SignalStrategy`: classification and actionable signal policy.
- Detector classes in `detectors/`: inject a `DetectorRule` with validated criteria.

Missing and holiday dates are retained as gaps: records are never synthesized. Zero volume and zero delivery quantity are valid inputs; ratios requiring a zero denominator return `null` rather than an invented value. Corporate-action treatment is intentionally a caller responsibility until a validated adjustment policy is adopted.
