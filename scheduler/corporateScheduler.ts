import cron from "node-cron";

const API = "http://localhost:3000/api/corporate-refresh";

async function refreshCorporate() {
  try {
    const response = await fetch(API);

    const data = await response.json();

    console.log(
      `[${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}] Corporate Refresh Success`,
      data
    );
  } catch (error) {
    console.error(
      `[${new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })}] Corporate Refresh Failed`,
      error
    );
  }
}

// Run once immediately when the scheduler starts
refreshCorporate();

// Run every 5 minutes during market hours (Mon–Fri, 9 AM–4:59 PM IST)
cron.schedule(
  "*/5 9-16 * * 1-5",
  refreshCorporate,
  {
    timezone: "Asia/Kolkata",
  }
);

console.log("Corporate Scheduler Started...");