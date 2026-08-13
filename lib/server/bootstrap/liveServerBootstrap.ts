import { adminDb } from "@/lib/firebase-admin";
import { kiteLiveService } from "@/lib/server/live/KiteLiveService";
import { getUniverseTokens } from "@/lib/tokenResolver/universeTokenResolver";
import { startEodScheduler } from "@/lib/scheduler/eodScheduler";

let started = false;
let schedulerStarted = false;

export async function ensureLiveServerStarted() {

    if (started) {
        console.log("[LiveServer] Already started");
        return;
    }

    started = true;
 if (!schedulerStarted) {

        schedulerStarted = true;

        startEodScheduler();

    }
    console.log(
        "[LiveServer] Initializing..."
    );

    const doc =
        await adminDb
            .collection("settings")
            .doc("kite")
            .get();

    if (!doc.exists) {

        console.log(
            "[LiveServer] settings/kite missing."
        );

        return;

    }

    const data = doc.data();

    const accessToken =
        data?.accessToken;

    if (!accessToken) {

        console.log(
            "[LiveServer] Access token missing."
        );

        return;

    }

    const tokens =
        getUniverseTokens();

    console.log(
        "[LiveServer] Tokens:",
        tokens.length
    );

    // BUILD-014 Disabled KiteLiveService

   

}

