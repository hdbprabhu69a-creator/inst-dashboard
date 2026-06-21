import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const { adminDb } = require("../lib/firebase-admin");

async function ingestCorporate() {
  console.log(
    "Corporate Announcement Ingestion Started"
  );

  const announcements = [
    {
      stock: "SBIN",
      type: "Board Meeting",
      summary: "FY27 Business Review",
      source: "NSE",
      date: "20-Jun-2026",
      time: "15:20",
    },
  ];

  let inserted = 0;

  for (const item of announcements) {
    const existing = await adminDb
      .collection("corporate_announcements")
      .where("stock", "==", item.stock)
      .where("summary", "==", item.summary)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log(
        `Skipped duplicate: ${item.stock}`
      );
      continue;
    }

    await adminDb
      .collection("corporate_announcements")
      .add({
        ...item,
        createdAt: Date.now(),
      });

    inserted++;
  }

  console.log(
    `Inserted ${inserted} announcements`
  );
}

ingestCorporate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });