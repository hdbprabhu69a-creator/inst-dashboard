const YahooFinance =
  require("yahoo-finance2").default;

const yahooFinance =
  new YahooFinance();

async function test() {

  try {

    const quote =
      await yahooFinance.quote(
        "GC=F"
      );

    console.log(
      JSON.stringify(
        quote,
        null,
        2
      )
    );

  } catch (
    error
  ) {

    console.error(
      error
    );

  }

}

test();