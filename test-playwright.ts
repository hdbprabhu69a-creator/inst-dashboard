import { chromium } from "playwright";

(async () => {

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  try {

    await page.goto(
      "https://example.com",
      {
        waitUntil: "load"
      }
    );

    console.log("Example OK");

  } catch (e) {

    console.error(e);

  }

  await browser.close();

})();
