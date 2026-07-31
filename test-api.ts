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
      waitUntil: "domcontentloaded"
    }
  );

  const response = await page.context().request.get(
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

  console.log("Records:", json.length);

  console.log(json[0]);

  await browser.close();

})();
