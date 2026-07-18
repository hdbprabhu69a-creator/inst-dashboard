import { getKiteClient } from "@/lib/kite/client";

export async function getFunds() {
  const kite = await getKiteClient();

  const equity = await kite.getMargins("equity");

  return equity;
}
