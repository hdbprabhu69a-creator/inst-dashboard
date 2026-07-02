import { getCachedAccessToken } from "./tokenCache";

export async function getHistoricalCandles(
  instrumentToken: number,
  from: Date,
  to: Date,
  interval: "day" | "minute" = "day"
) {
  const apiKey = process.env.KITE_API_KEY!;
  const accessToken = await getCachedAccessToken();

  const fromStr = from.toISOString().substring(0, 19);
  const toStr = to.toISOString().substring(0, 19);

  const url =
    `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}` +
    `?from=${encodeURIComponent(fromStr)}` +
    `&to=${encodeURIComponent(toStr)}`;

  console.log("HIST URL:", url);

  const res = await fetch(url, {
    headers: {
      "Authorization": `token ${apiKey}:${accessToken}`,
      "X-Kite-Version": "3",
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || json.status !== "success") {
    console.error("HIST RESPONSE:", json);
    throw new Error(json.message ?? "Historical API failed");
  }

  return json.data.candles;
}
