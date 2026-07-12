import cron from "node-cron";

const API="http://localhost:3000/api/institutional/eod-update";

cron.schedule(
  "40 15 * * 1-5",
  async()=>{

    try{

      const r=await fetch(API);
      const j=await r.json();

      console.log(
        "EOD UPDATE",
        new Date().toISOString(),
        j
      );

    }catch(e){

      console.error(
        "EOD FAILED",
        e
      );

    }

  },
  {
    timezone:"Asia/Kolkata"
  }
);

console.log(
  "Institutional EOD Scheduler Running"
);
