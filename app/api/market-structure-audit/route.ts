import { Workbook } from "exceljs";

import {
  collection,
  getDocs,
  
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function GET() {

  try {

    const workbook =
      new Workbook();

    workbook.creator =
      "Institutional Dashboard";

    workbook.created =
      new Date();

    //
    // SUMMARY SHEET
    //

    const summarySheet =
      workbook.addWorksheet(
        "Summary"
      );

    summarySheet.columns = [

      {
        header: "Symbol",
        key: "symbol",
        width: 18,
      },

      {
        header: "Candles",
        key: "candles",
        width: 12,
      },

      {
        header: "First Date",
        key: "firstDate",
        width: 18,
      },

      {
        header: "Last Date",
        key: "lastDate",
        width: 18,
      },

    ];

    //
    // LOAD UNIVERSE
    //

    const universeSnapshot =
      await getDocs(
        collection(
          db,
          "universe"
        )
      );

    console.log(
      "================================="
    );

    console.log(
      "TOTAL STOCKS:",
      universeSnapshot.size
    );

    console.log(
      "================================="
    );

    //
    // LOOP THROUGH ALL STOCKS
    //

    for (
      const stockDoc
      of universeSnapshot.docs
    ) {

      const stock =
        stockDoc.data();

      const symbol =
        stock.symbol ??
        stockDoc.id;

      console.log(
        "EXPORTING:",
        symbol
      );

      //
      // LOAD HISTORY
      //

      const historySnapshot =
  await getDocs(
    collection(
      db,
      "universe",
      stockDoc.id,
      "history"
    )
  );
      //
      // CREATE SHEET
      //

      const safeSheetName =
  String(symbol)
    .replace(/[\\/*?:[\]]/g, "_")
    .substring(0, 31);

const sheet =
  workbook.addWorksheet(
    safeSheetName
  );
      sheet.columns = [

        {
          header: "Date",
          key: "date",
          width: 15,
        },

        {
          header: "Open",
          key: "open",
          width: 15,
        },

        {
          header: "High",
          key: "high",
          width: 15,
        },

        {
          header: "Low",
          key: "low",
          width: 15,
        },

        {
          header: "Close",
          key: "close",
          width: 15,
        },

        {
          header: "Volume",
          key: "volume",
          width: 18,
        },

      ];

      //
      // WRITE HISTORY
      //

      const historyRows =
  historySnapshot.docs
    .map((doc) => {

      const c = doc.data();

      return {

        date: c.date,

        open: Number(c.open ?? 0),

        high: Number(c.high ?? 0),

        low: Number(c.low ?? 0),

        close: Number(c.close ?? 0),

        volume: Number(c.volume ?? 0),

      };

    })
    .sort(
      (a, b) =>
        String(a.date).localeCompare(
          String(b.date)
        )
    );
      sheet.addRows(
        historyRows
      );

      //
      // HEADER STYLE
      //

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

          column: 6,

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

      //
      // SUMMARY ENTRY
      //

      summarySheet.addRow({

        symbol,

        candles:
          historyRows.length,

        firstDate:
          historyRows.length
            ? historyRows[0].date
            : "",

        lastDate:
          historyRows.length
            ? historyRows[
                historyRows.length - 1
              ].date
            : "",

      });

    }
    //
    // SUMMARY SHEET FORMAT
    //

    summarySheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    summarySheet.autoFilter = {
      from: "A1",
      to: {
        row: 1,
        column: 4,
      },
    };

    summarySheet.getRow(1).eachCell(
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

    //
    // AUTO WIDTH SAFETY
    //

    workbook.eachSheet(
      (sheet) => {

        sheet.columns.forEach(
          (column) => {

            if (
              !column.width ||
              column.width < 15
            ) {
              column.width = 15;
            }

          }
        );

      }
    );

    console.log(
      "================================="
    );

    console.log(
      "EXCEL EXPORT COMPLETE"
    );

    console.log(
      "WORKSHEETS:",
      workbook.worksheets.length
    );

    console.log(
      "================================="
    );

        //
    // GENERATE EXCEL
    //

    const buffer =
      await workbook.xlsx.writeBuffer();

    return new Response(
      Buffer.from(buffer),
      {

        headers: {

          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "Content-Disposition":
            'attachment; filename="Institutional_History.xlsx"',

          "Cache-Control":
            "no-store",

        },

      }
    );

  } catch (error: any) {

    console.error(
      "================================="
    );

    console.error(
      "HISTORY EXPORT ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );

    return Response.json(
      {

        success: false,

        error:
          error?.message ??
          "Unknown Error",

      },
      {

        status: 500,

      }
    );

  }

}     