import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "./tokenCache";

export async function getHistoricalCandles(
  instrumentToken: number,
  from: Date,
  to: Date,
  interval: "day" | "minute" = "day"
) {
  const kite = new KiteConnect({
    api_key: process.env.KITE_API_KEY!,
  });

  kite.setAccessToken(
    await getCachedAccessToken()
  );

  const data =
    await kite.getHistoricalData(
      instrumentToken,
      interval,
      from,
      to,
      false,
      false
    );

  return data;
}
