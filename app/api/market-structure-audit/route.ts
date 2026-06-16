import { Workbook } from "exceljs";

export async function GET() {

  const response =
    await fetch(
      "http://localhost:3000/api/market-structure-csv",
      {
        cache: "no-store",
      }
    );

  const result =
    await response.json();

  if (
    !result.success ||
    !result.rows?.length
  ) {

    return Response.json({
      success: false,
      error: "No data found",
    });

  }

  const workbook =
    new Workbook();

  //
  // DAILY SHEET
  //

  const dailySheet =
    workbook.addWorksheet(
      "Daily"
    );

  dailySheet.columns = [

    {
      header: "Symbol",
      key: "symbol",
      width: 18,
    },

    {
      header: "CMP",
      key: "cmp",
      width: 15,
    },

    {
      header: "Open",
      key: "dailyOpen",
      width: 15,
    },

    {
      header: "High",
      key: "dailyHigh",
      width: 15,
    },

    {
      header: "Low",
      key: "dailyLow",
      width: 15,
    },

    {
      header: "Close",
      key: "dailyClose",
      width: 15,
    },

    {
      header: "Volume",
      key: "dailyVolume",
      width: 18,
    },

    {
      header: "VWAP",
      key: "dailyVWAP_Audit",
      width: 15,
    },

    {
      header: "Pivot",
      key: "dailyPVT",
      width: 15,
    },

    {
      header: "CPR TC",
      key: "dailyCPR_TC",
      width: 15,
    },

    {
      header: "CPR BC",
      key: "dailyCPR_BC",
      width: 15,
    },

    {
      header: "R1",
      key: "dailyR1",
      width: 15,
    },

    {
      header: "S1",
      key: "dailyS1",
      width: 15,
    },

  ];

  dailySheet.addRows(
    result.rows
  );

  //
  // WEEKLY SHEET
  //

  const weeklySheet =
    workbook.addWorksheet(
      "Weekly"
    );

  weeklySheet.columns = [

    {
      header: "Symbol",
      key: "symbol",
      width: 18,
    },

    {
      header: "CMP",
      key: "cmp",
      width: 15,
    },

    {
      header: "High",
      key: "weeklyHigh",
      width: 15,
    },

    {
      header: "Low",
      key: "weeklyLow",
      width: 15,
    },

    {
      header: "Close",
      key: "weeklyClose",
      width: 15,
    },

    {
      header: "Volume",
      key: "weeklyVolume",
      width: 18,
    },

    {
      header: "VWAP",
      key: "weeklyVWAP_Audit",
      width: 15,
    },

    {
      header: "Pivot",
      key: "weeklyPVT",
      width: 15,
    },

    {
      header: "CPR TC",
      key: "weeklyCPR_TC",
      width: 15,
    },

    {
      header: "CPR BC",
      key: "weeklyCPR_BC",
      width: 15,
    },

    {
      header: "R1",
      key: "weeklyR1",
      width: 15,
    },

    {
      header: "S1",
      key: "weeklyS1",
      width: 15,
    },

  ];

  weeklySheet.addRows(
    result.rows
  );

  //
  // MONTHLY SHEET
  //

  const monthlySheet =
    workbook.addWorksheet(
      "Monthly"
    );
    const deliverySheet =
  workbook.addWorksheet(
    "Delivery"
  );
  deliverySheet.columns = [

  {
    header: "Symbol",
    key: "symbol",
    width: 18,
  },

  {
    header: "D Vol",
    key: "totalVolumeDaily",
    width: 18,
  },

  {
    header: "D Del",
    key: "totalDeliveryDaily",
    width: 18,
  },

  {
    header: "D Del %",
    key: "deliveryPctDaily",
    width: 15,
  },

  {
    header: "W Vol",
    key: "totalVolumeWeekly",
    width: 18,
  },

  {
    header: "W Del",
    key: "totalDeliveryWeekly",
    width: 18,
  },

  {
    header: "W Del %",
    key: "deliveryPctWeekly",
    width: 15,
  },

  {
    header: "M Vol",
    key: "totalVolumeMonthly",
    width: 18,
  },

  {
    header: "M Del",
    key: "totalDeliveryMonthly",
    width: 18,
  },

  {
    header: "M Del %",
    key: "deliveryPctMonthly",
    width: 15,
  },

];
deliverySheet.addRows(
  result.rows
);

    const swingSheet =
  workbook.addWorksheet(
    "Swing"
  );
  swingSheet.columns = [

  {
    header: "Symbol",
    key: "symbol",
    width: 18,
  },

  {
    header: "1W High",
    key: "oneWeekHigh",
    width: 15,
  },

  {
    header: "1W Low",
    key: "oneWeekLow",
    width: 15,
  },

  {
    header: "1W Range",
    key: "oneWeekRange",
    width: 15,
  },

  {
    header: "1W High Date",
    key: "oneWeekHighDate",
    width: 22,
  },

  {
    header: "1W Low Date",
    key: "oneWeekLowDate",
    width: 22,
  },

  {
    header: "2W High",
    key: "twoWeekHigh",
    width: 15,
  },

  {
    header: "2W Low",
    key: "twoWeekLow",
    width: 15,
  },

  {
    header: "2W Range",
    key: "twoWeekRange",
    width: 15,
  },

  {
    header: "2W High Date",
    key: "twoWeekHighDate",
    width: 22,
  },

  {
    header: "2W Low Date",
    key: "twoWeekLowDate",
    width: 22,
  },

  {
    header: "1M High",
    key: "oneMonthHigh",
    width: 15,
  },

  {
    header: "1M Low",
    key: "oneMonthLow",
    width: 15,
  },

  {
    header: "1M Range",
    key: "oneMonthRange",
    width: 15,
  },

  {
    header: "1M High Date",
    key: "oneMonthHighDate",
    width: 22,
  },

  {
    header: "1M Low Date",
    key: "oneMonthLowDate",
    width: 22,
  },

  {
    header: "3M High",
    key: "threeMonthHigh",
    width: 15,
  },

  {
    header: "3M Low",
    key: "threeMonthLow",
    width: 15,
  },

  {
    header: "3M Range",
    key: "threeMonthRange",
    width: 15,
  },

  {
    header: "3M High Date",
    key: "threeMonthHighDate",
    width: 22,
  },

  {
    header: "3M Low Date",
    key: "threeMonthLowDate",
    width: 22,
  },

  {
    header: "6M High",
    key: "sixMonthHigh",
    width: 15,
  },

  {
    header: "6M Low",
    key: "sixMonthLow",
    width: 15,
  },

  {
    header: "6M Range",
    key: "sixMonthRange",
    width: 15,
  },

  {
    header: "6M High Date",
    key: "sixMonthHighDate",
    width: 22,
  },

  {
    header: "6M Low Date",
    key: "sixMonthLowDate",
    width: 22,
  },

  {
    header: "1Y High",
    key: "oneYearHigh",
    width: 15,
  },

  {
    header: "1Y Low",
    key: "oneYearLow",
    width: 15,
  },

  {
    header: "1Y Range",
    key: "oneYearRange",
    width: 15,
  },

  {
    header: "1Y High Date",
    key: "oneYearHighDate",
    width: 22,
  },

  {
    header: "1Y Low Date",
    key: "oneYearLowDate",
    width: 22,
  },

];
swingSheet.addRows(
  result.rows
);
const fibSheet =
  workbook.addWorksheet(
    "Fib"
  );
fibSheet.columns = [

  {
    header: "Symbol",
    key: "symbol",
    width: 18,
  },

  {
    header: "1W Fib 23.6",
    key: "oneWeekFib236",
    width: 15,
  },

  {
    header: "1W Fib 38.2",
    key: "oneWeekFib382",
    width: 15,
  },

  {
    header: "1W Fib 50",
    key: "oneWeekFib50",
    width: 15,
  },

  {
    header: "1W Fib 61.8",
    key: "oneWeekFib618",
    width: 15,
  },

  {
    header: "1W Fib 78.6",
    key: "oneWeekFib786",
    width: 15,
  },

  {
    header: "2W Fib 23.6",
    key: "twoWeekFib236",
    width: 15,
  },

  {
    header: "2W Fib 38.2",
    key: "twoWeekFib382",
    width: 15,
  },

  {
    header: "2W Fib 50",
    key: "twoWeekFib50",
    width: 15,
  },

  {
    header: "2W Fib 61.8",
    key: "twoWeekFib618",
    width: 15,
  },

  {
    header: "2W Fib 78.6",
    key: "twoWeekFib786",
    width: 15,
  },

  {
    header: "1M Fib 23.6",
    key: "oneMonthFib236",
    width: 15,
  },

  {
    header: "1M Fib 38.2",
    key: "oneMonthFib382",
    width: 15,
  },

  {
    header: "1M Fib 50",
    key: "oneMonthFib50",
    width: 15,
  },

  {
    header: "1M Fib 61.8",
    key: "oneMonthFib618",
    width: 15,
  },

  {
    header: "1M Fib 78.6",
    key: "oneMonthFib786",
    width: 15,
  },

  {
    header: "3M Fib 23.6",
    key: "threeMonthFib236",
    width: 15,
  },

  {
    header: "3M Fib 38.2",
    key: "threeMonthFib382",
    width: 15,
  },

  {
    header: "3M Fib 50",
    key: "threeMonthFib50",
    width: 15,
  },

  {
    header: "3M Fib 61.8",
    key: "threeMonthFib618",
    width: 15,
  },

  {
    header: "3M Fib 78.6",
    key: "threeMonthFib786",
    width: 15,
  },

  {
    header: "6M Fib 23.6",
    key: "sixMonthFib236",
    width: 15,
  },

  {
    header: "6M Fib 38.2",
    key: "sixMonthFib382",
    width: 15,
  },

  {
    header: "6M Fib 50",
    key: "sixMonthFib50",
    width: 15,
  },

  {
    header: "6M Fib 61.8",
    key: "sixMonthFib618",
    width: 15,
  },

  {
    header: "6M Fib 78.6",
    key: "sixMonthFib786",
    width: 15,
  },

  {
    header: "1Y Fib 23.6",
    key: "oneYearFib236",
    width: 15,
  },

  {
    header: "1Y Fib 38.2",
    key: "oneYearFib382",
    width: 15,
  },

  {
    header: "1Y Fib 50",
    key: "oneYearFib50",
    width: 15,
  },

  {
    header: "1Y Fib 61.8",
    key: "oneYearFib618",
    width: 15,
  },

  {
    header: "1Y Fib 78.6",
    key: "oneYearFib786",
    width: 15,
  },

];
fibSheet.addRows(
  result.rows
);

fibSheet.columns = [

  {
    header: "Symbol",
    key: "symbol",
    width: 18,
  },

  {
    header: "1W Fib236",
    key: "oneWeekFib236",
    width: 15,
  },

  {
    header: "1W Fib382",
    key: "oneWeekFib382",
    width: 15,
  },

  {
    header: "1W Fib50",
    key: "oneWeekFib50",
    width: 15,
  },

  {
    header: "1W Fib618",
    key: "oneWeekFib618",
    width: 15,
  },

  {
    header: "1W Fib786",
    key: "oneWeekFib786",
    width: 15,
  },

  {
    header: "2W Fib236",
    key: "twoWeekFib236",
    width: 15,
  },

  {
    header: "2W Fib382",
    key: "twoWeekFib382",
    width: 15,
  },

  {
    header: "2W Fib50",
    key: "twoWeekFib50",
    width: 15,
  },

  {
    header: "2W Fib618",
    key: "twoWeekFib618",
    width: 15,
  },

  {
    header: "2W Fib786",
    key: "twoWeekFib786",
    width: 15,
  },

  {
    header: "1M Fib236",
    key: "oneMonthFib236",
    width: 15,
  },

  {
    header: "1M Fib382",
    key: "oneMonthFib382",
    width: 15,
  },

  {
    header: "1M Fib50",
    key: "oneMonthFib50",
    width: 15,
  },

  {
    header: "1M Fib618",
    key: "oneMonthFib618",
    width: 15,
  },

  {
    header: "1M Fib786",
    key: "oneMonthFib786",
    width: 15,
  },

  {
    header: "3M Fib236",
    key: "threeMonthFib236",
    width: 15,
  },

  {
    header: "3M Fib382",
    key: "threeMonthFib382",
    width: 15,
  },

  {
    header: "3M Fib50",
    key: "threeMonthFib50",
    width: 15,
  },

  {
    header: "3M Fib618",
    key: "threeMonthFib618",
    width: 15,
  },

  {
    header: "3M Fib786",
    key: "threeMonthFib786",
    width: 15,
  },

  {
    header: "6M Fib236",
    key: "sixMonthFib236",
    width: 15,
  },

  {
    header: "6M Fib382",
    key: "sixMonthFib382",
    width: 15,
  },

  {
    header: "6M Fib50",
    key: "sixMonthFib50",
    width: 15,
  },

  {
    header: "6M Fib618",
    key: "sixMonthFib618",
    width: 15,
  },

  {
    header: "6M Fib786",
    key: "sixMonthFib786",
    width: 15,
  },

  {
    header: "1Y Fib236",
    key: "oneYearFib236",
    width: 15,
  },

  {
    header: "1Y Fib382",
    key: "oneYearFib382",
    width: 15,
  },

  {
    header: "1Y Fib50",
    key: "oneYearFib50",
    width: 15,
  },

  {
    header: "1Y Fib618",
    key: "oneYearFib618",
    width: 15,
  },

  {
    header: "1Y Fib786",
    key: "oneYearFib786",
    width: 15,
  },

];


  monthlySheet.columns = [

    {
      header: "Symbol",
      key: "symbol",
      width: 18,
    },

    {
      header: "CMP",
      key: "cmp",
      width: 15,
    },

    {
      header: "High",
      key: "monthlyHigh",
      width: 15,
    },

    {
      header: "Low",
      key: "monthlyLow",
      width: 15,
    },

    {
      header: "Close",
      key: "monthlyClose",
      width: 15,
    },

    {
      header: "Volume",
      key: "monthlyVolume",
      width: 18,
    },

    {
      header: "VWAP",
      key: "monthlyVWAP_Audit",
      width: 15,
    },

    {
      header: "Pivot",
      key: "monthlyPVT",
      width: 15,
    },

    {
      header: "CPR TC",
      key: "monthlyCPR_TC",
      width: 15,
    },

    {
      header: "CPR BC",
      key: "monthlyCPR_BC",
      width: 15,
    },

    {
      header: "R1",
      key: "monthlyR1",
      width: 15,
    },

    {
      header: "S1",
      key: "monthlyS1",
      width: 15,
    },

  ];

  monthlySheet.addRows(
    result.rows
  );

  //
  // HEADER STYLING
  //

  const sheets = [
  dailySheet,
  weeklySheet,
  monthlySheet,
  deliverySheet,
  swingSheet,
  fibSheet,
];
  sheets.forEach(
    (sheet) => {

      sheet.views = [
        {
          state: "frozen",
          ySplit: 1,
        },
      ];

      sheet.autoFilter = {
        from: "A1",
        to: {
          row: 1,
          column:
            sheet.columns.length,
        },
      };

      sheet.getRow(1).eachCell(
        (cell) => {

          cell.font = {
            bold: true,
            color: {
              argb: "FFFFFF",
            },
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "1F4E78",
            },
          };

        }
      );

    }
  );

  const buffer =
    await workbook.xlsx.writeBuffer();

  return new Response(
    Buffer.from(buffer),
    {

      headers: {

        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          'attachment; filename="INST_Dashboard_Audit.xlsx"',

      },

    }
  );

}