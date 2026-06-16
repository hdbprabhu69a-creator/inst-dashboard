import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(
  subject: string,
  text: string
) {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.ALERT_EMAIL,
    subject,
    text,
  });
}