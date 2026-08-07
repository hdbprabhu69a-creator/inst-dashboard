import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { canRunEOD } from "@/src/lib/eodGuard";
import { generateMarketStructure } from "@/lib/market/generateMarketStructure";

import { KiteConnect } from "kiteconnect";

import { getCachedAccessToken } from "@/lib/kite/tokenCache";
import { loadInstrumentMap } from "@/src/lib/kiteData";
import { getDailyCandles } from "@/src/lib/kiteData";

export async function runPendingEODIfRequired() {

    if (!canRunEOD()) {
        return;
    }

    //
    // Get latest available trading date from Kite
    //
    const accessToken =
        await getCachedAccessToken();

    if (!accessToken) {
        return;
    }

    const kite =
        new KiteConnect({
            api_key: process.env.KITE_API_KEY!,
        });

    kite.setAccessToken(accessToken);

    const instrumentMap =
        await loadInstrumentMap();

    //
    // SBIN is used only to determine
    // the latest completed trading day.
    //
    const token =
        instrumentMap.get("NSE:SBIN");

    if (!token) {
        return;
    }

    const candles =
        await getDailyCandles(
            kite,
            Number(token)
        );

    if (!candles.length) {
        return;
    }

    const latestTradingDate =
        new Date(
            candles[candles.length - 1].date
        )
        .toISOString()
        .split("T")[0];

    const eodStatusRef =
        doc(db, "settings", "eodStatus");

    const snap =
        await getDoc(eodStatusRef);

    const lastRunDate =
        snap.exists()
            ? snap.data().lastRunDate
            : null;

    //
    // Already processed latest market data
    //
    if (lastRunDate === latestTradingDate) {
        return;
    }

    console.log(
        "Running missed EOD..."
    );

    const stockResult =
        await generateMarketStructure({
            sourceCollection: "universe",
            targetCollection: "marketStructure",
            includeDelivery: true,
        });

    if (!stockResult.success) {
        console.error("Stock EOD failed");
        return;
    }

    const indexResult =
        await generateMarketStructure({
            sourceCollection: "universe_indices",
            targetCollection: "index_market_structure",
            includeDelivery: false,
        });

    if (!indexResult.success) {
        console.error("Index EOD failed");
        return;
    }

    await setDoc(
        eodStatusRef,
        {
            lastRunDate: latestTradingDate,
            session: "POST_CLOSE",
            updatedAt: serverTimestamp(),
        },
        {
            merge: true,
        }
    );

    console.log(
        "Missed EOD completed."
    );

}