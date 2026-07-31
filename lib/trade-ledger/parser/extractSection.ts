export function extractSection(
  text: string,
  start: RegExp,
  end: RegExp
): string {

  const s = text.search(start);

  if (s < 0) {
    return "";
  }

  const rest = text.substring(s);

  const e = rest.search(end);

  if (e < 0) {
    return rest;
  }

  return rest.substring(0, e);

}

