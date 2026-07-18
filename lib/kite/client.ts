import { KiteConnect } from "kiteconnect";
import { getCachedAccessToken } from "./tokenCache";

export async function getKiteClient() {
  const kite = new KiteConnect({
    api_key: process.env.KITE_API_KEY!,
  });

  kite.setAccessToken(
    await getCachedAccessToken()
  );

  return kite;
}
