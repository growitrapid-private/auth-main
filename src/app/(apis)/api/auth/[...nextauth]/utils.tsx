import { SendVerificationRequestParams } from "next-auth/providers/email";
import VerificationLinkEmail from "@/lib/emails/verification-links";
import SendEmail from "@/lib/emails/send-email";

export async function sendVerificationRequest(
  params: SendVerificationRequestParams
) {
  const { identifier, url, provider, theme, expires } = params;
  const { host } = new URL(url);
  const result = await SendEmail(
    provider.server,
    {
      to: identifier,
      from: {
        name: "GrowItRapid",
        address: provider.from,
      },
      subject: `Sign in to ${host}`,
    },
    text({ url, host }),
    VerificationLinkEmail(url, host, theme.colorScheme as string, expires)
  );
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
