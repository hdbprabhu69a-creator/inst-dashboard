"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  category: string;
  link: string;
  pubDate: string;
}

const ALLOWED_CATEGORIES = [

  "Markets",

  "Economy",

  "Money & Banking",

  "Companies",

  "Info-tech",

  "Agri Business",

  "Industry",

  "Energy",

  "Commodities",

  "Infrastructure",

  "Auto",

];

export default function BusinesslineFeed() {

  const [news, setNews] =
    useState<NewsItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [lastUpdated, setLastUpdated] =
    useState("");

  async function loadNews() {

    try {

      const response =
        await fetch(
          "/api/businessline-news"
        );

      const data =
        await response.json();

      if (
        data.success
      ) {

        const filtered =
          data.news
            .filter(
              (item: NewsItem) =>
                ALLOWED_CATEGORIES.includes(
                  item.category
                )
            )
            .slice(0, 15);

        setNews(
          filtered
        );

        setLastUpdated(
          new Date().toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        );

      }

    } catch (
      error
    ) {

      console.error(
        error
      );

    } finally {

      setLoading(
        false
      );

    }

  }

  useEffect(() => {

    loadNews();

    const interval =
      setInterval(
        loadNews,
        300000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[600px] overflow-y-auto">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-white font-bold">

          BusinessLine RSS Feed

        </h2>

        <div className="text-right">

          <div className="text-green-400 text-xs font-bold">

            LIVE • 5M

          </div>

          <div className="text-zinc-500 text-xs">

            {lastUpdated}

          </div>

        </div>

      </div>

      {loading ? (

        <div className="text-zinc-500">

          Loading...

        </div>

      ) : (

        <div className="space-y-3">

          {news.map(
            (
              item,
              index
            ) => (

              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block border border-zinc-800 rounded-lg p-3 hover:bg-zinc-800 transition"
              >

                <div className="flex justify-between items-center mb-2">

                  <span className="text-cyan-400 text-xs font-semibold">

                    {item.category}

                  </span>

                  <span className="text-zinc-500 text-xs">

                    {new Date(
                      item.pubDate
                    ).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}

                  </span>

                </div>

                <div className="text-white text-sm leading-6">

                  {item.title}

                </div>

              </a>

            )
          )}

        </div>

      )}

    </div>

  );

}