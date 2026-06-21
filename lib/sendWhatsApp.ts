export async function sendWhatsApp(message: string) {
  const body = new URLSearchParams({
    From: process.env.TWILIO_WHATSAPP_FROM!,
    To: "whatsapp:+919790905277",
    Body: message,
  });

  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );
}