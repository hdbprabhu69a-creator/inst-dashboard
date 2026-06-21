import "dotenv/config";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

console.log("=================================");
console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log(
  "CLIENT_EMAIL_EXISTS:",
  !!process.env.FIREBASE_CLIENT_EMAIL
);
console.log(
  "PRIVATE_KEY_EXISTS:",
  !!process.env.FIREBASE_PRIVATE_KEY
);
console.log("=================================");

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "FIREBASE_PRIVATE_KEY is missing"
  );
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId:
            process.env.FIREBASE_PROJECT_ID,

          clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

          privateKey:
            process.env.FIREBASE_PRIVATE_KEY.replace(
              /\\n/g,
              "\n"
            ),
        }),
      });

export const adminDb = getFirestore(app);