import { DELIVERY_CONFIG } from "@/lib/delivery/config";

let lastRun = "";

function todayIST() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

function nowIST() {
  return new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

let eodRefreshRun = "";

export function startEodScheduler() {

  console.log("[EOD Scheduler] Started");

  setInterval(async () => {

    const date = todayIST();
    const time = nowIST();

    if (lastRun === date) return;

    try {

      if (
        eodRefreshRun !== date &&
        time >= "15:35:00"
      ) {

        console.log("[EOD] Running refresh...");

        await fetch("http://localhost:3000/api/eod-refresh");

        eodRefreshRun = date;
      }

      const hhmm = time.substring(0,5);

      if (!(DELIVERY_CONFIG.RETRY_SCHEDULE as readonly string[]).includes(hhmm)) {
        return;
      }

      console.log("[Delivery] Attempt:", hhmm);

      const response =
        await fetch("http://localhost:3000/api/delivery-download");

      const result =
        await response.json();

      if (result.success) {

        console.log("[Delivery] Completed");

        console.log("[History] Updating...");

        await fetch("http://localhost:3000/api/kite/populate-history");

        console.log("[History] Completed");

        console.log("[EOD] Running refresh...");

        await fetch("http://localhost:3000/api/eod-refresh");

        console.log("[EOD] Completed");

        lastRun = date;
        eodRefreshRun = date;

      } else {

        console.log("[Delivery] Not available yet");

      }

    } catch (e) {

      console.error("[EOD Scheduler]", e);

    }

  },60000);

}


