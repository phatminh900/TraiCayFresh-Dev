import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import React from "react";

const CheckoutUserInfo = () => {
  return (
    <div>
      <PageSubTitle>Thông tin khách hàng</PageSubTitle>

      <div className='flex items-center gap-4'>
        <div data-cy='name-box-checkout'>
          <Label htmlFor='name'>Họ và tên</Label>
          <Input placeholder='Họ và tên' id='name' />
        </div>
        <div data-cy='phone-number-box-checkout'>
          <Label htmlFor='name'>Số điên thoại</Label>
          <Input placeholder='Họ và tên' id='name' />
        </div>
      </div>
    </div>
  );
};

export default CheckoutUserInfo;