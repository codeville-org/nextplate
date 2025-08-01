import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin as adminPlugin,
  openAPI,
  organization
} from "better-auth/plugins";

import { db } from "@api/db";
import env from "@api/env";
import * as schema from "@repo/database/schemas";

export const auth = betterAuth({
  // Cross-Domain Features
  trustedOrigins: [env.CLIENT_APP_URL],
  baseURL: env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url, token }) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url} \nToken: ${token}`
      });
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      // TODO: Implement email sending logic
      console.log({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url} \nToken: ${token}`
      });
    }
  },
  socialProviders: {
    // facebook: {
    // },
  },
  plugins: [
    adminPlugin(),
    openAPI(),
    organization({
      allowUserToCreateOrganization() {
        // TODO: In future, Allow permissions based on user's subscription
        return true;
      }
    })
  ]
});

export type Session = typeof auth.$Infer.Session;
