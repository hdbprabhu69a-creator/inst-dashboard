import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function cleanup() {
  const { adminDb } = require("../lib/firebase-admin");

  const snapshot = await adminDb
    .collection("corporate_announcements")
    .get();

  const seen = new Set();

  let deleted = 0;

  for (const doc of snapshot.docs) {
    const d = doc.data();

    const key =
      `${d.stock}|${d.summary}`;

    if (seen.has(key)) {
      await doc.ref.delete();
      deleted++;
    } else {
      seen.add(key);
    }
  }

  console.log(
    `Deleted ${deleted} duplicates`
  );
}

cleanup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });