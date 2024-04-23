import { cookies } from "next/headers";

import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import EmptyCart from "@/components/molecules/empty-cart";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/auth.service";
import CheckoutClient from "./_components/checkout-client";
import CheckoutListCart from "./_components/checkout-list-cart";

const CheckoutPage = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      {user!.cart!.items!.length < 1 ? (
        <EmptyCart />
      ) : (
        <CheckoutClient user={user}>
          <CheckoutListCart />
        </CheckoutClient>
      )}
    </div>
  );
};

export default CheckoutPage;
