import { z } from "zod";

export const Env = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  NEXT_PUBLIC_ENV: z.enum(["development", "production"]),

  // NextAuth
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),

  // Database
  MONGODB_URI: z.string(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),

  // Email
  EMAIL_SERVER_HOST: z.string(),
  EMAIL_SERVER_PORT: z.string(),
  EMAIL_SERVER_USER: z.string(),
  EMAIL_SERVER_PASSWORD: z.string(),
  NOREPLY_EMAIL_FROM: z.string(),
  SUPPORT_EMAIL_FROM: z.string(),
});

export type Env = z.infer<typeof Env>;

try {
  process.env = {
    ...process.env,
    ...Env.parse(process.env),
  };

  console.log("Environment Variables Verified");
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(error.errors);
  } else {
    console.error(error);
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
