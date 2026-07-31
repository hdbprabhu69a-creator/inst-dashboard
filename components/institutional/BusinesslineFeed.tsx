"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  category: string;
  link: string;
  pubDate: string;
}

const TABS = [
  "All",
  "Markets",
  "Economy",
  "Companies",
  "Money & Banking",
  "Agri Business",
  "Commodities",
];

export default function BusinesslineFeed() {

  const [news, setNews] =
    useState<NewsItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("All");

  async function loadNews() {

    try {

      const response =
        await fetch(
          "/api/businessline-news",
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (data.success) {

        const cleanedNews =
          data.news
            .filter(
              (item: NewsItem) =>
                item.title &&
                item.link
            )
            .map(
              (item: NewsItem) => ({
                ...item,
                category:
                  item.category
                    ?.replace(
                      "&amp;",
                      "&"
                    )
                    ?.trim(),
              })
            );

        setNews(
          cleanedNews
        );

      }

    } catch (error) {

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

  const filteredNews =
    activeTab === "All"
      ? news
      : news.filter(
          (item) =>
            item.category ===
            activeTab
        );

  if (loading) {

    return (

      <div className="p-4 text-zinc-500">

        Loading...

      </div>

    );

  }

  return (

    <div className="p-4">

      <div className="flex gap-2 overflow-x-auto border-b border-zinc-800 pb-3 mb-2">

        {TABS.map((tab) => (

          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab
              )
            }
            className={
              activeTab === tab
                ? "px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-amber-600 text-white"
                : "px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-zinc-900 text-zinc-400 hover:text-white"
            }
          >

            {tab}

          </button>

        ))}

      </div>

      <div className="mb-3 text-xs text-zinc-500">

        Total Articles:
        {" "}
        {filteredNews.length}

      </div>

      <div>

        {filteredNews.length === 0 && (

          <div className="text-zinc-500 py-6 text-center">

            No articles available

          </div>

        )}

        {filteredNews.map(
          (
            item,
            index
          ) => (

            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block py-2 hover:bg-zinc-950 transition"
            >

              <div className="flex justify-between mb-1">

                <span className="text-amber-500 text-xs">

                  {item.category}

                </span>

                <span className="text-zinc-500 text-xs">

                  {new Date(
                    item.pubDate
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}

                </span>

              </div>

              <div className="text-amber-50 text-lg leading-8">

                {item.title}

              </div>

              {index <
                filteredNews.length - 1 && (

                <div className="border-b border-zinc-800 mt-2" />

              )}

            </a>

          )
        )}

      </div>

    </div>

  );

}
