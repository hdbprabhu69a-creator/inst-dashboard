const YahooFinance =
  require("yahoo-finance2").default;

const yahooFinance =
  new YahooFinance({
    suppressNotices: [
      "yahooSurvey",
    ],
  });

async function test() {

  const symbols = [

    "^NSEI",
    "^NSEBANK",
    "^INDIAVIX",

  ];

  for (const symbol of symbols) {

    try {

      const quote =
        await yahooFinance.quote(
          symbol
        );

      console.log(
        "\n================="
      );

      console.log(
        symbol
      );

      console.log(
        "PRICE:",
        quote.regularMarketPrice
      );

      console.log(
        "CHANGE:",
        quote.regularMarketChangePercent
      );

    } catch (error) {

      console.log(
        symbol,
        "FAILED"
      );

      console.log(
        error.message
      );

    }

  }

}

test();