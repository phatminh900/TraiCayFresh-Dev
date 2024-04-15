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

const CheckoutPage = async() => {
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
    <CheckoutUserInfo />      
      <CheckoutAddress />
      <CheckoutListCart />
      <CheckoutNote />
      <CheckoutDiscount />
      <CheckoutPaymentMethods />
      <Button data-cy="submit-btn-checkout">Thanh toan</Button>
    </div>
  );
};

export default CheckoutPage;
