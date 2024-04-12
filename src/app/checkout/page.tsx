'use client'
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { useEffect } from "react";
import { DistrictAddress } from "./_components/districts-address";



const CheckoutPage = () => {
 
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
        <div className="flex flex-col gap-2">
          <div className='flex items-center gap-4'>
            <div>
              <Input placeholder='Hồ Chí Minh' />
            </div>
            <div>
              <Input value='Chọn quận / huyện' id='district-address' />
              <DistrictAddress />
            </div>
          </div>
          <div>
            <Input value='Chọn phường / xã' id='ward-address' />
          </div>
          <div>
            <Input value='Số nhà tên đường' id='street-address' />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
