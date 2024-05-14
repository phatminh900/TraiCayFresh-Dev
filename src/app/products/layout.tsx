import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getProducts } from "@/services/server/payload/products.service";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | TraiCayFresh",
};
const ProductsLayout = async({ children }: { children: ReactNode }) => {
await getProducts()
  return (
    <section>
      <BreadCrumbLinks
        links={[{ label: "Tất cả sản phẩm", href: APP_URL.products }]}
      />
      <PageTitle>Tất cả sản phẩm</PageTitle>
      {children}
    </section>
  );
};

export default ProductsLayout;
