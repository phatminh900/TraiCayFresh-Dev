
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "./constants/configs.constant";
import { APP_URL } from "./constants/navigation.constant";
import { ERROR_JWT_CODE, verifyToken } from "./utils/auth.util";
export async function middleware(req: NextRequest,res:NextResponse) {
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/favicon.ico") ) {
    return NextResponse.next();
  }
  // // check if payload token is set no point to login again

  const payloadToken = req.cookies.get("payload-token");

  const userToken = req.cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
  const isVerifiedToken = userToken && (await verifyToken(userToken));
  // if have code ==> error type

  if(isVerifiedToken && 'code' in isVerifiedToken && isVerifiedToken.code===ERROR_JWT_CODE.ERR_JWT_EXPIRED){
    console.log('sent')
 try {
 const response= await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    // const requestHeaders=new 
    body: JSON.stringify({token:userToken})
    
  })
  const result=await response.json()
  // try to set in the express but it din't work
  const nextResponse=NextResponse.next()
  if(result?.newToken){
    console.log('set')
    console.log('why not delete')
    req.cookies.delete(COOKIE_USER_PHONE_NUMBER_TOKEN)
  // nextResponse.cookies.set(COOKIE_USER_PHONE_NUMBER_TOKEN,result.newToken)

  }
 } catch (error) {
  req.cookies.delete(COOKIE_USER_PHONE_NUMBER_TOKEN);

    return NextResponse.redirect(new URL(APP_URL.login, req.url));
 }
    // Extract the user ID from the decoded payload
    // const userId = decoded.id;
    // refresh token for the phone number user ==> the email using https only doesn't need to refresh
    // const user=await payload.findByID({collection:'customer-phone-number',id})

  }
  // if have token on the server but expire generate a new token based on the refresh token
  const isValidToken= isVerifiedToken && !('code' in isVerifiedToken)
  console.log('--------------')
  console.log(isVerifiedToken)
  // const validToken=
  const isAuthenticated = payloadToken || isValidToken;
console.log('authen ticate')
console.log(isAuthenticated)
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
