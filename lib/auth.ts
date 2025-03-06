import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "@auth/core/jwt";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createUser, getUser } from "./data-service";
import { supabase } from "./supabase";

const authConfig: NextAuthConfig = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (error || !user) {
            console.error("Supabase auth error:", error);
            return null;
          }

          // Get or create user in our database
          const existingUser = await getUser(user.email);

          if (!existingUser) {
            await createUser({
              email: user.email!,
              fullName: user.user_metadata?.full_name || user.email!,
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        const dbUser = await getUser(user.email);
        if (dbUser?.id) {
          token.userId = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.userId = token.userId as number;
      }
      return session;
    },
    async authorized({ auth, request }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
