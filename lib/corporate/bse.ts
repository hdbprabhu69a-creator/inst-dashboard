export async function getBSEAnnouncements() {
  try {
    const response = await fetch(
      "https://www.bseindia.com",
      {
        cache: "no-store",
      }
    );
return [];
  } catch (error) {
    console.error(error);

    return [];
  }
}
