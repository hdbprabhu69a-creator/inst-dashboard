import { getKiteClient } from "@/lib/kite/client";

export async function getPositions() {
  const kite = await getKiteClient();
  return await kite.getPositions();
}
