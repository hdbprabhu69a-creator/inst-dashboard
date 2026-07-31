import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { CorporateAnnouncement } from "./types";
import { STOCK_UNIVERSE } from "@/lib/universe";

export async function importCorporateAnnouncements(
    rows: CorporateAnnouncement[]
) {

    let written = 0;

    let skipped = 0;

    const universe =
        new Set(
            STOCK_UNIVERSE.map(
                s => s.toUpperCase()
            )
        );

    for (const row of rows) {

        const symbol =
            String(row.symbol ?? "")
                .toUpperCase();

        if (!universe.has(symbol)) {

            skipped++;

            continue;

        }

        await adminDb
            .collection("corporate_announcements")
            .doc(row.seq_id)
            .set(
                {

                    symbol:
                        row.symbol,

                    companyName:
                        row.sm_name,

                    industry:
                        row.smIndustry,

                    isin:
                        row.sm_isin,

                    subject:
                        row.desc,

                    summary:
                        row.attchmntText,

                    pdf:
                        row.attchmntFile,

                    announcementDate:
                        row.an_dt,

                    exchangeTime:
                        row.exchdisstime,

                    sortDate:
                        row.sort_date,

                    fileSize:
                        row.fileSize,

                    hasXbrl:
                        row.hasXbrl,

                    source:
                        "NSE",

                    importedAt:
                        Timestamp.now()

                },
                {
                    merge: true
                }
            );

        written++;

    }

    return {

        success: true,

        written,

        skipped

    };

}

