import { chromium } from "playwright";
import fs from "fs";

(async () => {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  page.on("request", req => {
    console.log("REQ:", req.method(), req.url());
  });

  page.on("response", res => {
    console.log("RES:", res.status(), res.url());
  });

  await page.goto(
    "https://www.nseindia.com/companies-listing/corporate-filings-announcements",
    {
      waitUntil: "networkidle",
      timeout: 120000
    }
  );

  fs.mkdirSync("logs/playwright", { recursive: true });

  fs.writeFileSync(
    "logs/playwright/corporate.html",
    await page.content()
  );

  console.log("");
  console.log("======================================");
  console.log("PAGE OPENED");
  console.log("Click Download (.csv)");
  console.log("After download press Ctrl+C");
  console.log("======================================");

  await page.pause();

})();
