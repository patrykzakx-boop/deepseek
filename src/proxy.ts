import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const onboardingCompleted = session?.user?.onboardingCompleted;

  const path = nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isOnboardingRoute = path.startsWith("/onboarding");
  const isAuthPage = path === "/login" || path === "/register";

  // Chroń panel administratora - tylko rola ADMIN
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Wymuś kreator profilu dla zalogowanych użytkowników, którzy go nie ukończyli
  if (
    isLoggedIn &&
    !onboardingCompleted &&
    !isOnboardingRoute &&
    !isAuthPage &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  // Jeśli ukończył onboarding, a wchodzi na /onboarding - przekieruj dalej
  if (isOnboardingRoute && isLoggedIn && onboardingCompleted) {
    return NextResponse.redirect(new URL("/venues", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
