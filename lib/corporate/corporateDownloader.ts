import { chromium } from "playwright";
import { CorporateAnnouncement } from "./types";

export async function downloadCorporateAnnouncements()
: Promise<CorporateAnnouncement[]> {

    const browser = await chromium.launch({

        headless: false,

        args: [
            "--disable-http2",
            "--disable-quic",
            "--disable-features=UseDnsHttpsSvcb,NetworkServiceInProcess"
        ]

    });

    const context = await browser.newContext({

        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"

    });

    const page = await context.newPage();

    await page.goto(
        "https://www.nseindia.com",
        {
            waitUntil: "networkidle",
            timeout: 60000
        }
    );

    await page.waitForTimeout(3000);

    const response =
        await context.request.get(
            "https://www.nseindia.com/api/corporate-announcements?index=equities",
            {
                headers: {

                    Referer:
                        "https://www.nseindia.com/",

                    Origin:
                        "https://www.nseindia.com",

                    Accept:
                        "application/json"

                }
            }
        );

    if (!response.ok()) {

        throw new Error(
            `Corporate API failed : ${response.status()}`
        );

    }

    const data =
        await response.json();

    await browser.close();

    return data as CorporateAnnouncement[];

}
