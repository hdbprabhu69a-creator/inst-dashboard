import fs from "fs";
import path from "path";

export function convertToCSV(
  data: any[]
) {

  if (!data.length) {
    return "";
  }

  const headers =
    Object.keys(
      data[0]
    );

  const csvRows = [

    headers.join(","),

    ...data.map(
      (row) =>

        headers
          .map(
            (field) => {

              const value =
                row[field];

              if (
                value === null ||
                value === undefined
              ) {
                return "";
              }

              return `"${String(value).replace(/"/g, '""')}"`;

            }
          )
          .join(",")
    ),

  ];

  return csvRows.join(
    "\n"
  );

}

export function saveCSV(
  fileName: string,
  data: any[]
) {

  const csv =
    convertToCSV(
      data
    );

  const folder =
    path.join(
      process.cwd(),
      "data",
      "cache"
    );

  if (
    !fs.existsSync(
      folder
    )
  ) {

    fs.mkdirSync(
      folder,
      {
        recursive: true,
      }
    );

  }

  fs.writeFileSync(

    path.join(
      folder,
      fileName
    ),

    csv,

    "utf8"

  );

}