import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("businessline_news")
      .get();

    const news = snapshot.docs
      .map((doc) => {
        const d = doc.data();

        return {
          title: d.title || "",
          category: d.category || "General",
          link: d.link || "",
          pubDate: d.pubDate || "",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.pubDate).getTime() -
          new Date(a.pubDate).getTime()
      );

    return NextResponse.json({
      success: true,
      count: news.length,
      news,
    });
  } catch (error: any) {
    console.error(
      "BusinessLine Read Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        news: [],
      },
      {
        status: 500,
      }
    );
  }
}
