import { ROLE } from "@prisma/client";
import NextAuth, { DefaultSession, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: ROLE;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      role: ROLE;
    };
  }

  interface User {
    id?: UserId;
    role: ROLE;
  }
}

// declare module "next-auth" {
//   interface User {
//     role?: ROLE | undefined | unknown;
//     id?: UserId;
//   }
//   interface Session {
//     user: {
//       role?: ROLE | undefined | unknown;
//       id: string;
//     } & DefaultSession["user"];
//   }
// }
