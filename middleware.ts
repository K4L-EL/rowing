import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }

    // Redirect incomplete onboarding (skip welcome page itself to avoid loops)
    if (
      pathname !== "/dashboard/welcome" &&
      !pathname.startsWith("/dashboard/welcome/") &&
      req.auth.user?.onboardingComplete === false
    ) {
      return NextResponse.redirect(new URL("/dashboard/welcome", req.url));
    }

    // Role gating for sensitive routes
    const role = req.auth?.user?.role as string | undefined;

    if (pathname.startsWith("/dashboard/crew-builder")) {
      const allowedRoles = ["COACH", "ADMIN"];
      if (!role || !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/roles")) {
      const allowedRoles = ["ADMIN", "WELFARE_OFFICER", "COMMITTEE"];
      if (!role || !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
