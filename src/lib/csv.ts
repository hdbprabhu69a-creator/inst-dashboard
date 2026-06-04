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
            (field) =>
              row[field]
          )
          .join(",")
    ),

  ];

  return csvRows.join(
    "\n"
  );

}