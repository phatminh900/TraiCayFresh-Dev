import { getUserServer } from "@/services/server/payload/users.service";

import CheckoutClient from "../_components/checkout-client";
import CheckoutListCart from "../_components/checkout-list-cart";
import { redirect } from "next/navigation";
import { APP_URL } from "@/constants/navigation.constant";

const CheckoutCartPage = async () => {
  const user = await getUserServer()!;
  if (!user) redirect(APP_URL.login);

  return (
    <>
      <CheckoutClient user={user}>
        <CheckoutListCart user={user} />
      </CheckoutClient>
    </>
  );
};

export default CheckoutCartPage;
