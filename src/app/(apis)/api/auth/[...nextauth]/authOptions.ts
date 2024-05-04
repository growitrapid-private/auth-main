import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { sendVerificationRequest } from "./utils";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/db/db";
import config from "@/config";
import sessionHandler from "./session-handler";
import { createUser } from "@/functions/user";
import { DBAuthType } from "@/types/auth";

const useSecureCookies = process.env.NEXTAUTH_URL
  ? process.env.NEXTAUTH_URL.startsWith("https://")
  : false;
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(process.env.NEXTAUTH_URL ?? "").hostname;

export const nextAuthOptions: AuthOptions = {
  /**
   * Configure one or more authentication providers here.
   *
   * For a full list of providers, see:
   * @see https://next-auth.js.org/configuration/providers
   *
   * for example: We are using the Google provider here.
   */
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT as unknown as number,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.SUPPORT_EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    }),
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      /**
       * {...}
       *
       * For more information on each option (and a full list of options) go to:
       * @see https://next-auth.js.org/providers/google
       */
    }),
  ],

  /**
   * Currently supported database is Firebase.
   */
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: config.db.auth_name,
  }),

  /**
   * Add custom pages here, if needed.
   */
  pages: {
    signIn: "/signin",
    // signOut: '/signout',
    error: "/signin", // Error code passed in query string as ?error=
    verifyRequest: "/signin?verify_request", // (used for check email message)
    newUser: "/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * You can specify a handler for any of the callbacks below.
   *
   * @see https://next-auth.js.org/configuration/callbacks
   */
  callbacks: {
    async signIn({ user, account, profile, email, credentials, ...rest }) {
      return true;
    },
    async redirect({ url, baseUrl, ...rest }) {
      return baseUrl;
    },
    session: sessionHandler,
  },

  events: {
    createUser(message) {
      createUser(message.user as Partial<DBAuthType>);
    },
    signIn(message) {},
  },

  session: {
    maxAge: 7 * (24 * (60 * 60)), // 7 days
  },

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        maxAge: 900,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName == "localhost" ? hostName : "." + hostName, // add a . in front so that subdomains are included
      },
    },
  },
};
