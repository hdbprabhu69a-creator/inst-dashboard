import { adminDb } from "@/lib/firebase-admin";

export async function existsAnnouncement(
  stock: string,
  summary: string
): Promise<boolean> {
  const snapshot = await adminDb
    .collection("corporate_announcements")
    .where("stock", "==", stock)
    .where("summary", "==", summary)
    .limit(1)
    .get();

  return !snapshot.empty;
}
