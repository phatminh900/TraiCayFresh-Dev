import { cookies } from "next/headers";

import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import CheckoutAddress from "./_components/checkout-address";
import CheckoutDiscount from "./_components/checkout-discount";
import CheckoutListCart from "./_components/checkout-list-cart";
import CheckoutNote from "./_components/checkout-note";
import CheckoutPaymentMethods from "./_components/checkout-payment-methods";
import CheckoutUserInfo from "./_components/checkout-user-infor";
import { getUserServer } from "@/services/server/auth.service";
import { redirect } from "next/navigation";
import CheckoutDetails from "./_components/checkout-details";
import EmptyCart from "@/components/molecules/empty-cart";

const CheckoutPage = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  if (!user) redirect(APP_URL.login);
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      {user.cart!.items!.length < 1 ? (
        <EmptyCart />
      ) : (
        <>
          <CheckoutUserInfo />
          <CheckoutAddress />
          <CheckoutListCart />
          <CheckoutNote />
          <CheckoutDiscount user={user}/>
          <CheckoutPaymentMethods />
          <CheckoutDetails  />
          <Button className='mt-6 w-full' data-cy='submit-btn-checkout'>
            Thanh toan
          </Button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
