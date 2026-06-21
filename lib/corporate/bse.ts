export async function getBSEAnnouncements() {
  try {
    const response = await fetch(
      "https://www.bseindia.com",
      {
        cache: "no-store",
      }
    );

    console.log(
      "BSE STATUS:",
      response.status
    );

    return [];
  } catch (error) {
    console.error(error);

    return [];
  }
}