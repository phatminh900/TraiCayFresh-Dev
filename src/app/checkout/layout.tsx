"use client";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";

import PageTitle from "@/components/ui/page-title";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";
import { redirect, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const CheckoutLayout = ({
  children,
  checkoutBuyNow,
  checkoutCart,
}: {
  children: ReactNode;
  checkoutBuyNow: ReactNode;
  checkoutCart: ReactNode;
}) => {
  const searchParams = useSearchParams();

  const checkoutFlow = searchParams.get(APP_PARAMS.checkoutFlow);
  const productId = searchParams.get(APP_PARAMS.productId);
  console.log(productId);
  console.log(checkoutFlow);
  const content =
    checkoutFlow && checkoutFlow === "buy-now" && productId
      ? checkoutBuyNow
      : checkoutCart;
  return (
    <section>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      {children}
      {content}
    </section>
  );
};

export default CheckoutLayout;