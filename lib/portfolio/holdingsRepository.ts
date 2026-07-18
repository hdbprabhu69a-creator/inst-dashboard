import { getKiteClient } from "@/lib/kite/client";

export async function getHoldings() {
  const kite = await getKiteClient();
  return await kite.getHoldings();
}
