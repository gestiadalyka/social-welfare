import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in");
  const role = req.auth?.user.role;
  const path = req.nextUrl.pathname;

  console.log(req.auth?.user.role);

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isLoggedIn) {
    if (role === "ADMIN" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "MANAGER" && !path.startsWith("/manager")) {
      return NextResponse.redirect(new URL("/manager", req.url));
    }
    if (role === "USER" && path !== "/" && !path.startsWith("/user")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/manager/:path*",
    "/user/:path*",
    "/sign-in",
  ],
};
