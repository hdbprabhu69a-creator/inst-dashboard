export function normalizeRenderPlan(pattern: any) {

  if (!pattern) return null;

  const lines = pattern.lines || [];
  const targets = pattern.targets || [];
  const stopLoss = pattern.stopLoss || 0;
  const swings = pattern.swings || [];

  if (lines.length === 0) return null;

  return {
    lines,
    targets,
    stopLoss,
    swings
  };
}

