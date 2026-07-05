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

export function startEodScheduler() {

  console.log("[EOD Scheduler] Started");

  setInterval(async () => {

    const date = todayIST();
    const time = nowIST();

    if (lastRun === date) return;

    if (time < "15:35:00") return;

    try {

      console.log("[EOD Scheduler] Running...");

      await fetch("http://localhost:3000/api/eod-refresh");

      lastRun = date;

      console.log("[EOD Scheduler] Completed");

    } catch (e) {

      console.error("[EOD Scheduler]", e);

    }

  },60000);

}
