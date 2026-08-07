import cron from "node-cron";

import {
  runPendingEODIfRequired,
} from "@/lib/startup/eodRecovery";

const EOD_API = "http://localhost:3000/api/institutional/eod-update";

const HISTORY_API = "http://localhost:3000/api/kite/populate-history";

//
// Startup Recovery
//
(async () => {

  try {

    console.log(
      "Checking for pending History..."
    );

    const historyResponse =
      await fetch(HISTORY_API);

    if (!historyResponse.ok) {

      throw new Error(
        `History HTTP ${historyResponse.status}`
      );

    }

    await historyResponse.json();

    console.log(
      "History recovery completed."
    );

    console.log(
      "Checking for pending EOD..."
    );

    await runPendingEODIfRequired();

    console.log(
      "Startup EOD recovery completed."
    );

  } catch (error) {

    console.error(
      "Startup recovery failed:",
      error
    );

  }

})();

//
// Daily Scheduler
//
cron.schedule(

  "40 15 * * 1-5",

  async () => {

    try {

      console.log(
        "Running scheduled History..."
      );

      const historyResponse =
        await fetch(HISTORY_API);

      if (!historyResponse.ok) {

        throw new Error(
          `History HTTP ${historyResponse.status}`
        );

      }

      await historyResponse.json();

      console.log(
        "History update completed."
      );

      console.log(
        "Running scheduled EOD..."
      );

      const eodResponse =
        await fetch(EOD_API);

      if (!eodResponse.ok) {

        throw new Error(
          `EOD HTTP ${eodResponse.status}`
        );

      }

      const result =
        await eodResponse.json();

      console.log(
        "Scheduled EOD Completed:",
        result
      );

    } catch (error) {

      console.error(
        "Scheduled Recovery Failed:",
        error
      );

    }

  },

  {

    timezone: "Asia/Kolkata",

  }

);

console.log(`
====================================
Institutional Scheduler Started
Startup Recovery : ENABLED
History API      : ${HISTORY_API}
EOD API          : ${EOD_API}
Cron             : Weekdays 3:40 PM IST
====================================
`);