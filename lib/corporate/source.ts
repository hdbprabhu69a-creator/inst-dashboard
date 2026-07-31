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
      snapshot.docs.map(doc => doc.data() as CorporateAnnouncement);

    const filtered =
      filterUniverse(data);

    filtered.sort((a,b)=>
      new Date(b.sort_date).getTime() -
      new Date(a.sort_date).getTime()
    );

    return filtered.slice(0,200);

  } catch(error){

    console.error(
      "Corporate Announcement Error:",
      error
    );

    return [];

  }

}

