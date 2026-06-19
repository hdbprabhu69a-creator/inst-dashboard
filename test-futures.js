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

    "NQ=F",
    "ES=F",

    "^NSEI",
    "^NSEBANK",

    "NIFTYBEES.NS",

    "^NSEMDCP50",

    "DX-Y.NYB",

    "CL=F",

  ];

  for (const symbol of symbols) {

    try {

      const quote =
        await yahooFinance.quote(
          symbol
        );

      console.log("\n================");

      console.log(symbol);

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

    }

  }

}

test();