import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const response = await fetch(
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

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const result = parser.parse(xml);

    const items =
      result?.rss?.channel?.item || [];

    let saved = 0;

    for (const item of items) {
      const link = item.link || "";

      const docId = Buffer.from(link)
        .toString("base64")
        .replace(/\//g, "_");

      await adminDb
        .collection("businessline_news")
        .doc(docId)
        .set(
          {
            title: item.title || "",
            category: Array.isArray(item.category)
              ? item.category[0]
              : item.category || "General",
            link,
            pubDate: item.pubDate || "",
            createdAt: Date.now(),
          },
          { merge: true }
        );

      saved++;
    }

    return NextResponse.json({
      success: true,
      saved,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
