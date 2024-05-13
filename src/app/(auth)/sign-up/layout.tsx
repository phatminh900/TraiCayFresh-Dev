import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Đăng kí | TraiCayFresh",
};
const SignUpLayout = ({ children }: { children: ReactNode }) => {
  return <section>{children}</section>;
};

export default SignUpLayout;
