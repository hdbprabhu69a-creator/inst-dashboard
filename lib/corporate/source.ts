import { adminDb } from "@/lib/firebase-admin";
import { CorporateAnnouncement } from "./types";
import { filterUniverse } from "./filter";

export async function getCorporateAnnouncements(): Promise<CorporateAnnouncement[]> {
  try {
    const snapshot = await adminDb
      .collection("corporate_announcements")
      .limit(500)
      .get();

    const data: CorporateAnnouncement[] =
      snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          date: d.date || "",
          time: d.time || "",
          stock: d.stock || "",
          type: d.type || "",
          summary: d.summary || "",
          source: d.source || "NSE",
          attachment: d.attachment || "",
        };
      });

    const filtered = filterUniverse(data);

    filtered.sort((a, b) => {
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      );
    });

    return filtered.slice(0, 200);
  } catch (error) {
    console.error(
      "Corporate Announcement Error:",
      error
    );

    return [];
  }
}