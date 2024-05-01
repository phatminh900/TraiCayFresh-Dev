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
  // register
  // getCartOfUser(isEmailUser(user!)?'email':'phoneNumber',user?.id)
  if (!user) redirect(APP_URL.login);
  const userCart = user.cart;
  let content = <EmptyCart />;
  console.log(userCart!.items!.length)
  if (userCart!.items!.length) {
    content = (
      <CheckoutClient user={user}>
        {userCart!.items!.length && <CheckoutListCart user={user} />}
      </CheckoutClient>
    );
  }
  return (
    <section>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      {content}
    </section>
  );
};

export default CheckoutPage;
