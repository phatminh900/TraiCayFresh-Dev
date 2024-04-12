import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import DeliveryAddress from "@/components/molecules/delivery-address/delivery-address";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";

const CheckoutPage = async() => {
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.checkout, label: "Thanh toán" }]}
      />
      <PageTitle>Thanh toán</PageTitle>
      <PageSubTitle>Thông tin khách hàng</PageSubTitle>
      <form>
      <div className='flex items-center gap-4'>
        <div>
          <Label htmlFor='name'>Họ và tên</Label>
          <Input placeholder='Họ và tên' id='name' />
        </div>
        <div>
          <Label htmlFor='name'>Số điên thoại</Label>
          <Input placeholder='Họ và tên' id='name' />
        </div>
      </div>
      <PageSubTitle>Địa chỉ nhận hàng</PageSubTitle>
    <DeliveryAddress />
     
    </form>
    </div>
  );
};

export default CheckoutPage;
