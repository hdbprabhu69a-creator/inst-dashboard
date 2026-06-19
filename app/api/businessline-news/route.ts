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

    const news =
      items
        .slice(0, 20)
        .map((item: any) => ({

          title:
            item.title,

          category:
            item.category,

          link:
            item.link,

          pubDate:
            item.pubDate,

        }));

    return NextResponse.json({

      success: true,

      news,

    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      error:
        error.message,

    });

  }

}