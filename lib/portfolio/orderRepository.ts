import { getKiteClient } from "@/lib/kite/client";

export async function getOrders() {
  const kite = await getKiteClient();
  return await kite.getOrders();
}

