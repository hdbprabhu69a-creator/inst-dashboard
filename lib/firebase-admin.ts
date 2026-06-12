import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

console.log("=================================");
console.log("FIREBASE_PROJECT_ID =", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL =", process.env.FIREBASE_CLIENT_EMAIL);
console.log(
  "FIREBASE_PRIVATE_KEY_EXISTS =",
  !!process.env.FIREBASE_PRIVATE_KEY
);
console.log("=================================");

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId:
            process.env.FIREBASE_PROJECT_ID ||
            "inst-dashboard-6e9c6",

          clientEmail:
            process.env.FIREBASE_CLIENT_EMAIL,

          privateKey:
            process.env.FIREBASE_PRIVATE_KEY?.replace(
              /\\n/g,
              "\n"
            ),
        }),
      });

export const adminDb = getFirestore(app);