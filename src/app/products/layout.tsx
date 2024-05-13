import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | TraiCayFresh",
};
const ProductsLayout = ({ children }: { children: ReactNode }) => {
  return <section>{children}</section>;
};

export default ProductsLayout;
