export function parseMoney(value: string | undefined): number {
  if (!value) return 0;

  return Number(
    value.replace(/,/g, "").trim()
  ) || 0;
}

export function parseInteger(value: string | undefined): number {
  if (!value) return 0;

  return parseInt(
    value.replace(/,/g, "").trim(),
    10
  ) || 0;
}

export function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
