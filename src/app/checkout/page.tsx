import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import EmptyCart from "@/components/molecules/empty-cart";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";

import CheckoutClient from "./_components/checkout-client";
import CheckoutListCart from "./_components/checkout-list-cart";

import { redirect } from "next/navigation";

const CheckoutPage = async () => {
  const user = await getUserServer();
  if (!user) redirect(APP_URL.login);
 
  return (
    <section>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      <CheckoutClient user={user}>
     <CheckoutListCart user={user} />
      </CheckoutClient>
    </section>
  );
};

export default CheckoutPage;
