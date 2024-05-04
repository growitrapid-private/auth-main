import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import internal from "stream";

export default async function SendEmail(
  serveroptions: string | SMTPTransport | SMTPTransport.Options | undefined = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT as unknown as number,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  options: {
    to: string | Mail.Address | (string | Mail.Address)[];
    from: string | Mail.Address;
    subject: string;
  },
  text?: string | Buffer | internal.Readable | Mail.AttachmentLike,
  html?: string | Buffer | internal.Readable | Mail.AttachmentLike
) {
  try {
    const transport = createTransport(serveroptions);
    return await transport.sendMail({
      to: options.to,
      from: options.from || {
        name: "GrowItRapid",
        address: process.env.NOREPLY_EMAIL_FROM,
      },
      subject: options.subject,
      text: text,
      html: html,
      replyTo: options.from || {
        name: "GrowItRapid",
        address: process.env.NOREPLY_EMAIL_FROM,
      },
      cc: process.env.SUPPORT_EMAIL_FROM,
      // dkim: {
      //   domainName: "growitrapid.com",
      //   keySelector: "default",
      //   privateKey: process.env.DKIM_PRIVATE_KEY,
      // }
      encoding: "utf8",
    });
  } catch (error) {
    throw new Error(`Email could not be sent: ${error}`);
  }
}
