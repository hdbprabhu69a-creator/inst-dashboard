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

  const worksheet =
    workbook.addWorksheet(
      "Market Structure"
    );

  worksheet.columns =
    Object.keys(
      result.rows[0]
    ).map((key) => ({

      header: key,

      key: key,

      width: 18,

    }));

  worksheet.addRows(
    result.rows
  );

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  worksheet.autoFilter = {
    from: "A1",
    to: {
      row: 1,
      column:
        worksheet.columns.length,
    },
  };

  worksheet.getRow(1).height =
    28;

  worksheet.getRow(1).eachCell(
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

      cell.alignment = {

        horizontal:
          "center",

        vertical:
          "middle",

        wrapText: true,

      };

    }
  );

  worksheet.eachRow(
    (row, rowNumber) => {

      if (
        rowNumber === 1
      ) return;

      row.height = 22;

      row.eachCell(
        (cell) => {

          cell.alignment = {

            horizontal:
              "center",

            vertical:
              "middle",

            wrapText: true,

          };

          cell.border = {

            top: {
              style: "thin",
            },

            left: {
              style: "thin",
            },

            bottom: {
              style: "thin",
            },

            right: {
              style: "thin",
            },

          };

          if (
            typeof cell.value ===
            "number"
          ) {

            cell.numFmt =
              "0.00";

          }

        }
      );

    }
  );

  worksheet.columns.forEach(
    (column) => {

      let maxLength = 12;

      column.eachCell?.(
        {
          includeEmpty: true,
        },
        (cell) => {

          const length =
            String(
              cell.value ?? ""
            ).length;

          if (
            length > maxLength
          ) {

            maxLength =
              length;

          }

        }
      );

      column.width =
        Math.min(
          maxLength + 3,
          25
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
