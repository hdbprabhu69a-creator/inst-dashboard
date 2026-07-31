import { KiteConnect } from "kiteconnect";

export const kite = new KiteConnect({
  api_key: process.env.KITE_API_KEY!,
});
