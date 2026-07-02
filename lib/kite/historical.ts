import { getCachedAccessToken } from "./tokenCache";

export async function getHistoricalCandles(
  instrumentToken: number,
  from: Date,
  to: Date,
  interval: "day" | "minute" = "day"
) {
  const apiKey = process.env.KITE_API_KEY!;
  const accessToken = await getCachedAccessToken();

  const fromStr = from.toISOString().substring(0,19).replace("T"," ");
  const toStr = to.toISOString().substring(0,19).replace("T"," ");

  const url =
    `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}` +
    `?from=${encodeURIComponent(fromStr)}` +
    `&to=${encodeURIComponent(toStr)}`;

  console.log("HIST URL:", url);
  console.log("AUTH HEADER:", `token ${apiKey}:********`);
  console.log("API KEY:", apiKey);
  console.log("FROM:", fromStr);
  console.log("TO:", toStr);

  const res = await fetch(url, {
  headers: {
    Authorization: `token ${apiKey}:${accessToken}`,
    "X-Kite-Version": "3",
  },
  cache: "no-store",
});

const text = await res.text();

console.log("HTTP STATUS:", res.status);
console.log("HTTP BODY:", text);

let json:any = {};

try {
  json = text ? JSON.parse(text) : {};
} catch {
  json = {};
}

if (!res.ok || json.status !== "success") {
  throw new Error(json.message ?? text);
}

return json.data.candles;
}



