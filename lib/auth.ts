import type { NextAuthConfig, Session } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, getUser } from "./data-service";
import { NextRequest } from "next/server";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    authorized({
      auth,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }): boolean {
      return !!auth?.user; // returns a boolean
    },
    async signIn({ user }) {
      console.log("Sign-in user details:", user);

      try {
        const existingUser = await getUser(user.email);
        console.log("Existing guest:", existingUser);

        if (!user.email || !user.name) {
          throw new Error("Email and name is required for creating a guest");
        }

        if (!existingUser) {
          console.log("User does not exist, creating new user...");
          await createUser({ email: user.email, fullName: user.name });
        }

        return true; // Sign-in successful
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Sign-in failed
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, user }) {
      const sessionUser = await getUser(session.user.email);
      if (!sessionUser || sessionUser.id === null) {
        console.error("User not found for email:", session.user.email);
        throw new Error("User not found");
      }

      // session.user.userId = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
