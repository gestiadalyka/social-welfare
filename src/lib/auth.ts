import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        householdNumber: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.householdNumber || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const householdNumberString = credentials?.householdNumber as string;
        const credPassword = credentials?.password as string;

        const user = await prisma.user.findUnique({
          where: {
            householdNumber: householdNumberString,
          },
        });

        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        if (user.password === "!def@ult") {
          if (credentials.password === "!def@ult") {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        }

        const isCorrectPassword = await bcrypt.compare(
          credPassword,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const isAuthPage = nextUrl.pathname.startsWith("/sign-in");

      if (isAuthPage) {
        if (isLoggedIn)
          return Response.redirect(new URL("/dashboard", nextUrl));
        return true;
      } else if (!isLoggedIn) {
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.id = user.id as string;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.id = token.id as string;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
});
