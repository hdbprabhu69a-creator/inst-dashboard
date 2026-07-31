import { chromium } from "playwright";
import fs from "fs";

(async () => {

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
  });

  const page = await context.newPage();

  // Visit home page only to establish cookies
  await page.goto(
    "https://www.nseindia.com",
    {
      waitUntil: "domcontentloaded",
      timeout: 120000
    }
  );

  await page.waitForTimeout(3000);

  const response = await context.request.get(
    "https://www.nseindia.com/api/corporate-announcements?index=equities",
    {
      headers: {
        Referer: "https://www.nseindia.com/",
        Accept: "application/json"
      }
    }
  );

  console.log("STATUS:", response.status());

  const json = await response.json();

  console.log(json[0]);

  fs.mkdirSync("logs/playwright", {
    recursive: true
  });

  fs.writeFileSync(
    "logs/playwright/corporate.json",
    JSON.stringify(json, null, 2)
  );

  await browser.close();

})();
