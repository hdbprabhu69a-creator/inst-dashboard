import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export async function GET() {

  try {

    const response =
      await fetch(
        "https://www.thehindubusinessline.com/feeder/default.rss",
        {
          cache: "no-store",
        }
      );

    if (!response.ok) {

      throw new Error(
        `RSS fetch failed: ${response.status}`
      );

    }

    const xml =
      await response.text();

    const parser =
      new XMLParser({
        ignoreAttributes: false,
      });

    const result =
      parser.parse(xml);

    const items =
      result?.rss?.channel?.item || [];

    const sevenDaysAgo =
      Date.now() -
      7 * 24 * 60 * 60 * 1000;

    const news =
      items
        .filter((item: any) => {

          if (!item.pubDate)
            return false;

          const articleDate =
            new Date(
              item.pubDate
            ).getTime();

          return (
            articleDate >=
            sevenDaysAgo
          );

        })
        .map((item: any) => ({

          title:
            item.title || "",

          category:
            Array.isArray(
              item.category
            )
              ? item.category[0]
              : item.category ||
                "General",

          link:
            item.link || "",

          pubDate:
            item.pubDate || "",

        }))
        .sort(
          (
            a: any,
            b: any
          ) =>
            new Date(
              b.pubDate
            ).getTime() -
            new Date(
              a.pubDate
            ).getTime()
        )
        .slice(0, 200);

    return NextResponse.json({

      success: true,

      count:
        news.length,

      news,

    });

  } catch (error: any) {

    console.error(
      "BusinessLine API Error:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        error:
          error.message,

        count: 0,

        news: [],

      },
      {
        status: 500,
      }
    );

  }

}