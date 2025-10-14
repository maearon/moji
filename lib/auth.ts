import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendEmail } from "./email";
import { db } from "@/db";

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
 
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  pages: {
    signIn: "/",
    signOut: "/",
  },
  socialProviders: {
    facebook: { 
      clientId: process.env.FACEBOOK_CLIENT_ID as string, 
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string, 
    }, 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        await sendEmail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
});
