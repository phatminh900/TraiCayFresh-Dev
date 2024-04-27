import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from "./constants/navigation.constant";
import { verifyToken } from "./utils/auth.util";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "./constants/configs.constant";
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/favicon.ico") ) {
    return NextResponse.next();
  }
  // // check if payload token is set no point to login again

  const payloadToken = req.cookies.get("payload-token");

  const userToken = req.cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;

  const isVerifiedToken = userToken && (await verifyToken(userToken));
  const isAuthenticated = payloadToken || isVerifiedToken;
  const isLoginOrSignUpRoute =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/sign-up');

  // if verified token send to home
  if (isLoginOrSignUpRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_URL.home, req.url));
  }
  // // no token and access login
  if (!isAuthenticated && isLoginOrSignUpRoute) {
    return NextResponse.next();
  }
  // // no token access protected router
  const publicRoutes = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/cart",
    "/products",
    "/",
    "/verify-email",
  ];
  const isPublicRoute=publicRoutes.some(route=>{
    const startsWithRegExp = new RegExp(`^${route}(\/|$)`);
    return startsWithRegExp.test(req.nextUrl.pathname);
  })
  // If user is not authenticated and trying to access a non-public route, redirect to login
  // console.log(publicRoutes.includes(req.nextUrl.pah))
  if (!isAuthenticated && !isPublicRoute) {
    console.log('redirect')
    return NextResponse.redirect(new URL(APP_URL.login, req.url));
  }
  return NextResponse.next();
}
