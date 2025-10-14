export const runtime = "nodejs";

import nodemailer from "nodemailer";
interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "manhng132@gmail.com",
      pass: "rqisoolrehrwayum",
    },
    from: "manhng132@gmail.com",
  });
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_USERNAME,
    to,
    subject,
    text,
  });
}
