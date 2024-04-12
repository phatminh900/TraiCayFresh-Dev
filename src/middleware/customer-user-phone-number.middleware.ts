import { NextRequest, NextResponse } from "next/server";
const customerUserPhoneNumber = (req: NextRequest) => {
  console.log(req.nextUrl.pathname);
  return NextResponse.next();
};
export default customerUserPhoneNumber;
