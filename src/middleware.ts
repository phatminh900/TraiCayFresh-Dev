import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from "./constants/navigation.constant";
import { verifyToken } from "./utils/auth.util";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "./constants/configs.constant";
export async function middleware(req: NextRequest) {

  // if (req.nextUrl.pathname.startsWith("/_next")) {
  //   return NextResponse.next();
  //   }
  // // check if payload token is set no point to login again
  // const payloadToken = req.cookies.get("payload-token");
  // if (
  //   (req.nextUrl.pathname.startsWith(APP_URL.login) ||
  //     req.nextUrl.pathname.startsWith(APP_URL.signUp)) &&
  //   payloadToken
  // ) {
  //   return NextResponse.redirect(new URL(APP_URL.home, req.url));
  // }

  // const userToken = req.cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
  // // no token and access protected router redirect
  // if (
  //   !userToken &&
  //   (!req.nextUrl.pathname.startsWith(APP_URL.login) &&
  //     !req.nextUrl.pathname.startsWith(APP_URL.signUp))
  // ) {
  //   return NextResponse.redirect(new URL(APP_URL.login, req.url));
  // }
  // const isVerifiedToken =userToken && await verifyToken(userToken);
  // // if verified token send to home
  // if( (req.nextUrl.pathname.startsWith(APP_URL.login) ||
  // req.nextUrl.pathname.startsWith(APP_URL.signUp)) &&
  // isVerifiedToken){
  //   return NextResponse.redirect(new URL(APP_URL.home, req.url));

  // }
  // // no token and access login
  // if(!isVerifiedToken &&  (req.nextUrl.pathname.startsWith(APP_URL.login) ||
  // req.nextUrl.pathname.startsWith(APP_URL.signUp))){
  //   return NextResponse.next()
  // }
  // // no token access protected router 
  // if(!isVerifiedToken){
  //   return NextResponse.redirect(new URL(APP_URL.login, req.url));
  // }
  // return NextResponse.next()
}
export const config = {
  matcher: ['/login','/sign-up'],
};
