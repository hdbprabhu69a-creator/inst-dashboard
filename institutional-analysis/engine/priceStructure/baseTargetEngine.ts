export function baseTargetEngine(
  input:any
){

  const swing =
    input.swing ?? {};


  const threeMonth =
    swing.threeMonthSwing ?? {};


  const oneMonth =
    swing.oneMonthSwing ?? {};


  const previousBase =
    threeMonth.low ?? 0;


  const expansionHigh =
    threeMonth.high ?? 0;


  const height =
    threeMonth.range ??
    (
      expansionHigh -
      previousBase
    );


  const markdownLow =
    oneMonth.low ?? 0;


  const status =
    input.cmp >= expansionHigh
      ? "BREAKOUT"
      : "BASE_FORMING";


  return {

    previousBase:{

      date:
        threeMonth.lowDate ?? null,

      price:
        Number(
          previousBase.toFixed(2)
        )

    },


    expansionHigh:{

      date:
        threeMonth.highDate ?? null,

      price:
        Number(
          expansionHigh.toFixed(2)
        )

    },


    markdownLow:{

      date:
        oneMonth.lowDate ?? null,

      price:
        Number(
          markdownLow.toFixed(2)
        )

    },


    height:
      Number(
        height.toFixed(2)
      ),


    breakoutLevel:
      Number(
        expansionHigh.toFixed(2)
      ),


    status,


    nextTarget:
      Number(
        (
          expansionHigh + height
        ).toFixed(2)
      )

  };

}

