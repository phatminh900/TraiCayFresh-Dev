import { cookies } from "next/headers";

import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import EmptyCart from "@/components/molecules/empty-cart";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/auth.service";
import CheckoutClient from "./_components/checkout-client";
import CheckoutListCart from "./_components/checkout-list-cart";
import { getCartOfUser } from "@/services/server/payload.service";
import { isEmailUser } from "@/utils/util.utls";
import { redirect } from "next/navigation";

const CheckoutPage = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  // register
  getCartOfUser(isEmailUser(user!)?'email':'phoneNumber',user?.id)
  if(!user) redirect(APP_URL.login)
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
          <CheckoutListCart user={user}/>
        </CheckoutClient>
      )}
    </div>
  );
};

export default CheckoutPage;
