
app\api\build-heatmap-cache\route.ts
Line 5
getDocs,

app\api\build-heatmap-cache\route.ts
Line 7
setDoc,

app\api\build-heatmap-cache\route.ts
Line 17
await getDocs(

app\api\build-heatmap-cache\route.ts
Line 18
collection(

app\api\build-heatmap-cache\route.ts
Line 84
await setDoc(

app\api\build-heatmap-cache\route.ts
Line 86
doc(

app\api\build-sector-heatmap-cache\route.ts
Line 4
getDocs,

app\api\build-sector-heatmap-cache\route.ts
Line 6
setDoc,

app\api\build-sector-heatmap-cache\route.ts
Line 12
const snapshot = await getDocs(

app\api\build-sector-heatmap-cache\route.ts
Line 13
collection(db, "heatmap_cache")

app\api\build-sector-heatmap-cache\route.ts
Line 118
await setDoc(

app\api\build-sector-heatmap-cache\route.ts
Line 119
doc(

app\api\build-trend-score\route.ts
Line 5
getDocs,

app\api\build-trend-score\route.ts
Line 7
updateDoc,

app\api\build-trend-score\route.ts
Line 17
await getDocs(

app\api\build-trend-score\route.ts
Line 18
collection(

app\api\build-trend-score\route.ts
Line 84
await updateDoc(

app\api\build-trend-score\route.ts
Line 86
doc(

app\api\businessline-news\route.ts
Line 2
import { adminDb } from "@/lib/firebase-admin";

app\api\businessline-news\route.ts
Line 6
const snapshot = await adminDb

app\api\businessline-news\route.ts
Line 7
.collection("businessline_news")

app\api\debug\gujgas\route.ts
Line 2
import { collection, getDocs, query, where } from "firebase/firestore";

app\api\debug\gujgas\route.ts
Line 6
const snap = await getDocs(

app\api\debug\gujgas\route.ts
Line 8
collection(db,"universe"),

app\api\debug-history\route.ts
Line 2
import { collection, getDocs, query, where } from "firebase/firestore";

app\api\debug-history\route.ts
Line 7
const u = await getDocs(

app\api\debug-history\route.ts
Line 9
collection(db,"universe"),

app\api\debug-history\route.ts
Line 20
const h=await getDocs(

app\api\debug-history\route.ts
Line 21
collection(

app\api\delete-history\route.ts
Line 5
getDocs,

app\api\delete-history\route.ts
Line 7
writeBatch,

app\api\delete-history\route.ts
Line 16
await getDocs(

app\api\delete-history\route.ts
Line 17
collection(

app\api\delete-history\route.ts
Line 31
await getDocs(

app\api\delete-history\route.ts
Line 32
collection(

app\api\delete-history\route.ts
Line 41
writeBatch(db);

app\api\delete-history\route.ts
Line 47
doc(

app\api\delete-test\route.ts
Line 5
getDocs,

app\api\delete-test\route.ts
Line 23
collection(

app\api\delete-test\route.ts
Line 35
await getDocs(

app\api\delete-test\route.ts
Line 41
await deleteDoc(

app\api\delete-test\route.ts
Line 42
doc(

app\api\delete-test\route.ts
Line 53
await deleteDoc(

app\api\delete-test\route.ts
Line 54
doc(

app\api\delivery-bulk\route.ts
Line 10
getDocs,

app\api\delivery-bulk\route.ts
Line 12
getDoc,

app\api\delivery-bulk\route.ts
Line 13
setDoc,

app\api\delivery-bulk\route.ts
Line 66
await getDocs(

app\api\delivery-bulk\route.ts
Line 67
collection(

app\api\delivery-bulk\route.ts
Line 213
doc(

app\api\delivery-bulk\route.ts
Line 220
await getDoc(

app\api\delivery-bulk\route.ts
Line 224
await setDoc(

app\api\eod-refresh\route.ts
Line 5
getDoc,

app\api\eod-refresh\route.ts
Line 6
setDoc,

app\api\eod-refresh\route.ts
Line 79
doc(

app\api\eod-refresh\route.ts
Line 86
await getDoc(

app\api\eod-refresh\route.ts
Line 176
await setDoc(

app\api\export-history\route.ts
Line 5
getDocs,

app\api\export-history\route.ts
Line 12
const universe = await getDocs(

app\api\export-history\route.ts
Line 13
collection(db,"universe")

app\api\export-history\route.ts
Line 22
const history = await getDocs(

app\api\export-history\route.ts
Line 23
collection(

app\api\export-history-excel\route.ts
Line 10
import { collection,getDocs } from "firebase/firestore";

app\api\export-history-excel\route.ts
Line 34
const universe=await getDocs(collection(db,"universe"));

app\api\export-history-excel\route.ts
Line 52
const history=await getDocs(

app\api\export-history-excel\route.ts
Line 53
collection(

app\api\firebase-audit\route.ts
Line 5
getDocs,

app\api\firebase-audit\route.ts
Line 12
const snapshot = await getDocs(

app\api\firebase-audit\route.ts
Line 13
collection(

app\api\firebase-audit-csv\route.ts
Line 5
getDocs,

app\api\firebase-audit-csv\route.ts
Line 15
await getDocs(

app\api\firebase-audit-csv\route.ts
Line 16
collection(

app\api\heatmap\route.ts
Line 5
getDocs,

app\api\heatmap\route.ts
Line 15
await getDocs(

app\api\heatmap\route.ts
Line 16
collection(

app\api\heatmap-quotes\route.ts
Line 5
getDocs,

app\api\heatmap-quotes\route.ts
Line 15
await getDocs(

app\api\heatmap-quotes\route.ts
Line 16
collection(

app\api\history\route.ts
Line 5
getDocs,

app\api\history\route.ts
Line 26
await getDocs(

app\api\history\route.ts
Line 28
collection(db,"universe"),

app\api\history\route.ts
Line 45
await getDocs(

app\api\history\route.ts
Line 47
collection(

app\api\jobs\businessline-init\route.ts
Line 2
import { adminDb } from "@/lib/firebase-admin";

app\api\jobs\businessline-init\route.ts
Line 6
await adminDb

app\api\jobs\businessline-init\route.ts
Line 7
.collection("businessline_news")

app\api\jobs\businessline-init\route.ts
Line 8
.doc("test")

app\api\jobs\businessline-news\route.ts
Line 3
import { adminDb } from "@/lib/firebase-admin";

app\api\jobs\businessline-news\route.ts
Line 40
await adminDb

app\api\jobs\businessline-news\route.ts
Line 41
.collection("businessline_news")

app\api\jobs\businessline-news\route.ts
Line 42
.doc(docId)

app\api\kite\history\route.ts
Line 3
import { adminDb } from "@/lib/firebase-admin";

app\api\kite\history\route.ts
Line 16
const tokenDoc = await adminDb

app\api\kite\history\route.ts
Line 17
.collection("settings")

app\api\kite\history\route.ts
Line 18
.doc("kite")

app\api\kite\populate-history\route.ts
Line 6
getDocs,

app\api\kite\populate-history\route.ts
Line 7
getDoc,

app\api\kite\populate-history\route.ts
Line 13
writeBatch,

app\api\kite\populate-history\route.ts
Line 16
import { adminDb } from "@/lib/firebase-admin";

app\api\kite\populate-history\route.ts
Line 98
const snapshot = await getDocs(collection(db, "universe"));

app\api\kite\populate-history\route.ts
Line 120
const historyRef = collection(

app\api\kite\populate-history\route.ts
Line 127
const latestSnap = await getDocs(

app\api\kite\populate-history\route.ts
Line 194
let batch = writeBatch(db);

app\api\kite\populate-history\route.ts
Line 199
const ref = doc(

app\api\kite\populate-history\route.ts
Line 222
batch = writeBatch(db);

app\api\kite\populate-tokens\route.ts
Line 6
getDocs,

app\api\kite\populate-tokens\route.ts
Line 8
getDoc,

app\api\kite\populate-tokens\route.ts
Line 9
updateDoc,

app\api\kite\populate-tokens\route.ts
Line 19
const snapshot = await getDocs(

app\api\kite\populate-tokens\route.ts
Line 20
collection(db, "universe")

app\api\kite\populate-tokens\route.ts
Line 32
const tokenDoc = await getDoc(

app\api\kite\populate-tokens\route.ts
Line 33
doc(db, "settings", "kite")

app\api\kite\populate-tokens\route.ts
Line 84
await updateDoc(

app\api\kite\populate-tokens\route.ts
Line 85
doc(

app\api\kite\preview-history\route.ts
Line 7
getDocs,

app\api\kite\preview-history\route.ts
Line 50
await getDocs(

app\api\kite\preview-history\route.ts
Line 51
collection(db,"universe")

app\api\kite\repair-history\route.ts
Line 6
getDocs,

app\api\kite\repair-history\route.ts
Line 7
getDoc,

app\api\kite\repair-history\route.ts
Line 9
writeBatch,

app\api\kite\repair-history\route.ts
Line 59
await getDocs(collection(db, "universe"));

app\api\kite\repair-history\route.ts
Line 71
await getDocs(

app\api\kite\repair-history\route.ts
Line 72
collection(

app\api\kite\repair-history\route.ts
Line 103
const batch = writeBatch(db);

app\api\kite\repair-history\route.ts
Line 108
const ref = doc(

app\api\kite\route.ts
Line 4
import { adminDb } from "@/lib/firebase-admin";

app\api\kite\route.ts
Line 38
await adminDb

app\api\kite\route.ts
Line 39
.collection("settings")

app\api\kite\route.ts
Line 40
.doc("kite")

app\api\kite\sync-history\route.ts
Line 6
getDocs,

app\api\kite\sync-history\route.ts
Line 8
getDoc,

app\api\kite\sync-history\route.ts
Line 9
setDoc,

app\api\kite\sync-history\route.ts
Line 20
await getDoc(

app\api\kite\sync-history\route.ts
Line 21
doc(

app\api\kite\sync-history\route.ts
Line 49
await getDocs(

app\api\kite\sync-history\route.ts
Line 50
collection(

app\api\kite\sync-history\route.ts
Line 100
await setDoc(

app\api\kite\sync-history\route.ts
Line 102
doc(

app\api\macro-dashboard\route.ts
Line 7
getDoc,

app\api\macro-dashboard\route.ts
Line 15
await getDoc(

app\api\macro-dashboard\route.ts
Line 17
doc(

app\api\macro-refresh\route.ts
Line 9
setDoc,

app\api\macro-refresh\route.ts
Line 136
await setDoc(

app\api\macro-refresh\route.ts
Line 137
doc(

app\api\market-heatmap\route.ts
Line 5
getDocs,

app\api\market-heatmap\route.ts
Line 15
await getDocs(

app\api\market-heatmap\route.ts
Line 16
collection(

app\api\market-heatmap\route.ts
Line 23
await getDocs(

app\api\market-heatmap\route.ts
Line 24
collection(

app\api\market-structure\route.ts
Line 6
getDocs,

app\api\market-structure\route.ts
Line 8
getDoc,

app\api\market-structure\route.ts
Line 9
setDoc,

app\api\market-structure\route.ts
Line 25
await getDocs(

app\api\market-structure\route.ts
Line 26
collection(

app\api\market-structure\route.ts
Line 55
await getDoc(

app\api\market-structure\route.ts
Line 56
doc(

app\api\market-structure\route.ts
Line 316
await setDoc(

app\api\market-structure\route.ts
Line 318
doc(

app\api\market-structure-audit\route.ts
Line 5
getDocs,

app\api\market-structure-audit\route.ts
Line 66
await getDocs(

app\api\market-structure-audit\route.ts
Line 67
collection(

app\api\market-structure-audit\route.ts
Line 96
await getDocs(

app\api\market-structure-audit\route.ts
Line 97
collection(

app\api\market-structure-bulk\route.ts
Line 6
getDocs,

app\api\market-structure-bulk\route.ts
Line 8
getDoc,

app\api\market-structure-bulk\route.ts
Line 9
setDoc,

app\api\market-structure-bulk\route.ts
Line 26
await getDoc(

app\api\market-structure-bulk\route.ts
Line 27
doc(

app\api\market-structure-bulk\route.ts
Line 56
await getDocs(

app\api\market-structure-bulk\route.ts
Line 57
collection(

app\api\market-structure-bulk\route.ts
Line 109
await getDoc(

app\api\market-structure-bulk\route.ts
Line 110
doc(

app\api\market-structure-bulk\route.ts
Line 191
await setDoc(

app\api\market-structure-bulk\route.ts
Line 193
doc(

app\api\market-structure-bulk-v2\route.ts
Line 33
getDocs,

app\api\market-structure-bulk-v2\route.ts
Line 35
getDoc,

app\api\market-structure-bulk-v2\route.ts
Line 36
setDoc,

app\api\market-structure-bulk-v2\route.ts
Line 92
doc(

app\api\market-structure-bulk-v2\route.ts
Line 99
await getDoc(

app\api\market-structure-bulk-v2\route.ts
Line 139
await getDoc(

app\api\market-structure-bulk-v2\route.ts
Line 140
doc(

app\api\market-structure-bulk-v2\route.ts
Line 172
await getDocs(

app\api\market-structure-bulk-v2\route.ts
Line 173
collection(

app\api\market-structure-bulk-v2\route.ts
Line 360
await getDocs(

app\api\market-structure-bulk-v2\route.ts
Line 362
collection(

app\api\market-structure-bulk-v2\route.ts
Line 507
await setDoc(

app\api\market-structure-bulk-v2\route.ts
Line 509
doc(

app\api\market-structure-bulk-v2\route.ts
Line 600
await setDoc(

app\api\market-structure-csv\route.ts
Line 5
getDocs,

app\api\market-structure-csv\route.ts
Line 36
await getDocs(

app\api\market-structure-csv\route.ts
Line 37
collection(

app\api\scanner\route.ts
Line 5
getDocs,

app\api\scanner\route.ts
Line 22
await getDocs(

app\api\scanner\route.ts
Line 23
collection(

app\api\scanner\route.ts
Line 30
await getDocs(

app\api\scanner\route.ts
Line 31
collection(

app\api\scanner\route.ts
Line 124
await getDocs(

app\api\scanner\route.ts
Line 125
collection(

app\api\scanner\route.ts
Line 132
await getDocs(

app\api\scanner\route.ts
Line 133
collection(

app\api\scanner-alert\route.ts
Line 7
getDocs,

app\api\scanner-alert\route.ts
Line 8
getDoc,

app\api\scanner-alert\route.ts
Line 9
setDoc,

app\api\scanner-alert\route.ts
Line 32
await getDocs(

app\api\scanner-alert\route.ts
Line 33
collection(

app\api\scanner-alert\route.ts
Line 82
doc(

app\api\scanner-alert\route.ts
Line 89
await getDoc(

app\api\scanner-alert\route.ts
Line 101
await setDoc(

app\api\scanner-filter\route.ts
Line 5
getDocs,

app\api\scanner-filter\route.ts
Line 24
await getDocs(

app\api\scanner-filter\route.ts
Line 25
collection(

app\api\scanner-filter\route.ts
Line 36
await getDocs(

app\api\scanner-filter\route.ts
Line 37
collection(

app\api\scan-stock\route.ts
Line 6
getDoc,

app\api\scan-stock\route.ts
Line 36
await getDoc(

app\api\scan-stock\route.ts
Line 37
doc(

app\api\sector-heatmap\route.ts
Line 5
getDocs,

app\api\sector-heatmap\route.ts
Line 15
await getDocs(

app\api\sector-heatmap\route.ts
Line 16
collection(

app\api\sector-stocks\route.ts
Line 5
getDocs,

app\api\sector-stocks\route.ts
Line 30
await getDocs(

app\api\sector-stocks\route.ts
Line 31
collection(

app\api\structure-scan\route.ts
Line 6
getDoc,

app\api\structure-scan\route.ts
Line 33
await getDoc(

app\api\structure-scan\route.ts
Line 34
doc(

app\api\swing-cache-bulk\route.ts
Line 6
getDocs,

app\api\swing-cache-bulk\route.ts
Line 8
getDoc,

app\api\swing-cache-bulk\route.ts
Line 19
await getDoc(

app\api\swing-cache-bulk\route.ts
Line 20
doc(

app\api\swing-cache-bulk\route.ts
Line 55
await getDocs(

app\api\swing-cache-bulk\route.ts
Line 56
collection(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 5
getDocs,

app\api\sync-sector-to-heatmap-cache\route.ts
Line 9
updateDoc,

app\api\sync-sector-to-heatmap-cache\route.ts
Line 19
await getDocs(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 20
collection(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 39
collection(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 51
await getDocs(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 68
await updateDoc(

app\api\sync-sector-to-heatmap-cache\route.ts
Line 70
doc(

app\api\telegram-buyzone\route.ts
Line 5
getDocs,

app\api\telegram-buyzone\route.ts
Line 25
await getDocs(

app\api\telegram-buyzone\route.ts
Line 26
collection(

app\api\test-firestore\route.ts
Line 2
import { adminDb } from "@/lib/firebase-admin";

app\api\test-firestore\route.ts
Line 6
const snap = await adminDb

app\api\test-firestore\route.ts
Line 7
.collection("settings")

app\api\test-firestore\route.ts
Line 8
.doc("kite")

app\api\token\route.ts
Line 5
import { adminDb } from "@/lib/firebase-admin";

app\api\token\route.ts
Line 75
await adminDb

app\api\token\route.ts
Line 76
.collection("settings")

app\api\token\route.ts
Line 77
.doc("kite")

app\api\universe\route.ts
Line 4
getDocs,

app\api\universe\route.ts
Line 11
const snapshot = await getDocs(

app\api\universe\route.ts
Line 12
collection(db, "universe")

app\api\watchlist\route.ts
Line 2
import { adminDb } from "@/lib/firebase-admin";

app\api\watchlist\route.ts
Line 5
import { collection, getDocs } from "firebase/firestore";

app\api\watchlist\route.ts
Line 99
getDocs(

app\api\watchlist\route.ts
Line 100
collection(

app\api\watchlist\route.ts
Line 105
getDocs(

app\api\watchlist\route.ts
Line 106
collection(

app\api\watchlist\route.ts
Line 129
await adminDb

app\api\watchlist\route.ts
Line 130
.collection("settings")

app\api\watchlist\route.ts
Line 131
.doc("kite")

lib\corporate\dedupe.ts
Line 1
import { adminDb } from "@/lib/firebase-admin";

lib\corporate\dedupe.ts
Line 7
const snapshot = await adminDb

lib\corporate\dedupe.ts
Line 8
.collection("corporate_announcements")

lib\corporate\source.ts
Line 1
import { adminDb } from "@/lib/firebase-admin";

lib\corporate\source.ts
Line 7
const snapshot = await adminDb

lib\corporate\source.ts
Line 8
.collection("corporate_announcements")

lib\firebase-admin.ts
Line 30
export const adminDb = getFirestore(app);

lib\history\importCsv.ts
Line 4
writeBatch,

lib\history\importCsv.ts
Line 24
const batch = writeBatch(db);

lib\history\importCsv.ts
Line 28
const ref = doc(

lib\history\importCsv.ts
Line 29
collection(

lib\kite\tokenCache.ts
Line 1
import { adminDb } from "@/lib/firebase-admin";

lib\kite\tokenCache.ts
Line 16
const doc = await adminDb

lib\kite\tokenCache.ts
Line 17
.collection("settings")

lib\kite\tokenCache.ts
Line 18
.doc("kite")

lib\live\candleEngine.ts
Line 9
getDocs,

lib\server\bootstrap\liveServerBootstrap.ts
Line 1
import { adminDb } from "@/lib/firebase-admin";

lib\server\bootstrap\liveServerBootstrap.ts
Line 23
await adminDb

lib\server\bootstrap\liveServerBootstrap.ts
Line 24
.collection("settings")

lib\server\bootstrap\liveServerBootstrap.ts
Line 25
.doc("kite")

lib\universe\universeService.ts
Line 1
import { collection, getDocs } from "firebase/firestore";

lib\universe\universeService.ts
Line 9
const snap = await getDocs(collection(db, "universe"));

scripts\cleanup-corporate.ts
Line 8
const { adminDb } = require("../lib/firebase-admin");

scripts\cleanup-corporate.ts
Line 10
const snapshot = await adminDb

scripts\cleanup-corporate.ts
Line 11
.collection("corporate_announcements")

scripts\clearUniverse.ts
Line 3
getDocs,

scripts\clearUniverse.ts
Line 12
await getDocs(

scripts\clearUniverse.ts
Line 13
collection(

scripts\clearUniverse.ts
Line 21
await deleteDoc(

scripts\import-corporate.ts
Line 9
const { adminDb } = require("../lib/firebase-admin");

scripts\import-corporate.ts
Line 73
const existing = await adminDb

scripts\import-corporate.ts
Line 74
.collection(

scripts\import-corporate.ts
Line 87
await adminDb

scripts\import-corporate.ts
Line 88
.collection(

scripts\import-history.ts
Line 9
writeBatch,

scripts\import-history.ts
Line 127
writeBatch(db);

scripts\import-history.ts
Line 209
doc(

scripts\import-history.ts
Line 345
writeBatch(db);

scripts\ingest-corporate.ts
Line 7
const { adminDb } = require("../lib/firebase-admin");

scripts\ingest-corporate.ts
Line 28
const existing = await adminDb

scripts\ingest-corporate.ts
Line 29
.collection("corporate_announcements")

scripts\ingest-corporate.ts
Line 42
await adminDb

scripts\ingest-corporate.ts
Line 43
.collection("corporate_announcements")

scripts\seed-corporate.ts
Line 8
const { adminDb } = require("../lib/firebase-admin");

scripts\seed-corporate.ts
Line 10
await adminDb

scripts\seed-corporate.ts
Line 11
.collection("corporate_announcements")

scripts\uploadUniverse.ts
Line 8
getDocs,

scripts\uploadUniverse.ts
Line 10
addDoc,

scripts\uploadUniverse.ts
Line 34
await getDocs(

scripts\uploadUniverse.ts
Line 35
collection(

scripts\uploadUniverse.ts
Line 47
await deleteDoc(

scripts\uploadUniverse.ts
Line 63
await addDoc(

scripts\uploadUniverse.ts
Line 64
collection(
