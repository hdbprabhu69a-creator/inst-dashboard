import { chromium } from "playwright";

(async () => {

  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-http2",
      "--disable-quic",
      "--disable-features=UseDnsHttpsSvcb,NetworkServiceInProcess"
    ]
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.nseindia.com",
    {
      waitUntil: "domcontentloaded",
      timeout: 120000
    }
  );

  console.log("NSE Loaded");

  await page.waitForTimeout(5000);

  await browser.close();

})();
