export function buildMetadata() {

  return {

    updatedAt:
      new Date()
        .toISOString(),

    updatedAtReadable:
      new Date()
        .toLocaleString(
          "en-IN",
          {
            timeZone:
              "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        ),

  };

}