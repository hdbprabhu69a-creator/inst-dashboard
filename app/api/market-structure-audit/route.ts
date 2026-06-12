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
  swingSheet,
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