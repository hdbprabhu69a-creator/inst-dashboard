import cron from "node-cron";

import { NSE_REPORT_CONFIG } from "../lib/nse-reports/config";
import { downloadNseFiiDiiReport } from "../lib/nse-reports/playwrightDownloader";

function readRetryTimes() {
  const value = process.env.NSE_REPORT_RETRY_TIMES;
  return value ? value.split(",").map((time) => time.trim()).filter(Boolean) : [...NSE_REPORT_CONFIG.retry.times];
}

const retryTimes = readRetryTimes();
const cutoff = process.env.NSE_REPORT_RETRY_CUTOFF ?? NSE_REPORT_CONFIG.retry.cutoff;
let completedDate = "";

function istNow() {
  const values = new Intl.DateTimeFormat("en-CA", {
    timeZone: NSE_REPORT_CONFIG.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => values.find((value) => value.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

cron.schedule("* * * * *", async () => {
  const now = istNow();
  if (completedDate === now.date || now.time > cutoff || !retryTimes.includes(now.time)) return;

  try {
    const result = await downloadNseFiiDiiReport();
    console.log("[NSE report]", result);
    // A non-trading-day decision is final too; don't run the remaining slots.
    completedDate = now.date;
  } catch (error) {
    console.error("[NSE report] attempt failed; next configured slot will retry", error);
  }
}, { timezone: NSE_REPORT_CONFIG.timezone });

console.log(`[NSE report] scheduler started: ${retryTimes.join(", ")} IST; cutoff ${cutoff} IST`);
