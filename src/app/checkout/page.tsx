import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import DeliveryAddress from "@/components/molecules/delivery-address/delivery-address";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import CheckoutAddress from "./_components/checkout-address";

const CheckoutPage = async() => {
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      <PageSubTitle>Thông tin khách hàng</PageSubTitle>
      <CheckoutAddress />
    </div>
  );
};

export default CheckoutPage;
