export function findNumber(
  text: string,
  pattern: RegExp
): number {

  const match = text.match(pattern);

  if (!match) {
    return 0;
  }

  return Number(
    match[1].replace(/,/g, "")
  ) || 0;

}

export function findText(
  text: string,
  pattern: RegExp
): string | undefined {

  return text.match(pattern)?.[1]?.trim();

}

export function lines(
  text: string
): string[] {

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

}

