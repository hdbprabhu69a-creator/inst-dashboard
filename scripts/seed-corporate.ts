import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function seed() {
  const { adminDb } = require("../lib/firebase-admin");

  await adminDb
    .collection("corporate_announcements")
    .add({
      date: "20-Jun-2026",
      time: "15:20",
      stock: "SBIN",
      type: "Board Meeting",
      summary: "FY27 Business Review",
      source: "NSE",
      createdAt: Date.now(),
    });

  console.log("Corporate announcement seeded");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });