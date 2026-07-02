import { adminDb } from "@/lib/firebase-admin";

let cachedToken: string | null = null;
let cachedAt = 0;

const CACHE_MS = 1000 * 60 * 30; // 30 minutes

export async function getCachedAccessToken(): Promise<string> {
  if (
    cachedToken &&
    Date.now() - cachedAt < CACHE_MS
  ) {
    return cachedToken!;
  }

  const doc = await adminDb
    .collection("settings")
    .doc("kite")
    .get();

  if (!doc.exists) {
    throw new Error("settings/kite document not found");
  }

  const token = doc.data()?.accessToken;

  if (!token) {
    throw new Error("No Kite access token");
  }

  cachedToken = token;
  cachedAt = Date.now();

  return cachedToken!;
}

export function clearKiteTokenCache() {
  cachedToken = null;
  cachedAt = 0;
}


