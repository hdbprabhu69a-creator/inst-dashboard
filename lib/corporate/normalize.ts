export function normalizeType(
  text: string
): string {
  const t = text.toLowerCase();

  if (t.includes("board"))
    return "Board Meeting";

  if (t.includes("result"))
    return "Results";

  if (t.includes("dividend"))
    return "Dividend";

  if (t.includes("presentation"))
    return "Presentation";

  if (t.includes("investor"))
    return "Investor Meet";

  if (t.includes("order"))
    return "Order Win";

  return "Corporate";
}

export function normalizeSymbol(
  symbol: string
): string {
  const s = symbol
    .trim()
    .toUpperCase();

  const map: Record<string, string> = {
    INDIANBANK: "INDIANB",
    INDIANBANKLTD: "INDIANB",

    CITYUNIONBANK: "CUB",
    CITYUNION: "CUB",

    KARURVYSYABANK: "KARURVYSYA",

    BAJAJAUTO: "BAJAJ-AUTO",

    MUTHOOTFINANCE: "MUTHOOTFIN",

    BHARTIAIRTEL: "BHARTIARTL",
  };

  return map[s] || s;
}
