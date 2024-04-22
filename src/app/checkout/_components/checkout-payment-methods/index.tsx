"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PageSubTitle from "@/components/ui/page-subTitle";
import { trpc } from "@/trpc/trpc-client";

enum PAYMENT_METHOD {
  "BY_CASH" = "BY_CASH",
  "MOMO" = "MOMO",
  "CREDIT_TRANSFER" = "CREDIT_TRANSFER",
}

const CheckoutPaymentMethods = () => {

  const { mutate: checkoutWithMomo, isPending: isCheckingOutMomo } =
    trpc.payment.payWithMomo.useMutation({
      onError: (err) => {
        console.log(err);
      },
      onSuccess: (data) => {
        console.log('-----')
        // @ts-ignore
        if(data?.payUrl){
        // @ts-ignore
          window.open(data.payUrl,'_black')
          console.log('----')
          console.log(data)
          console.log('not go in here???')
        }
        console.log(data);
      },
    });
  const [method, setMethod] = useState<PAYMENT_METHOD>(PAYMENT_METHOD.BY_CASH);
  return (
    <div>
      <PageSubTitle>Phương thức thanh toán</PageSubTitle>
      <RadioGroup
        data-cy='payment-method-box'
        className='mt-8'
        onValueChange={(value) => {
          setMethod(value as PAYMENT_METHOD);
        }}
        defaultValue={method}
      >
        <div data-cy='payment-method' className='flex items-center space-x-2'>
          <RadioGroupItem value={PAYMENT_METHOD.BY_CASH} id='by-cash' />
          <Label
            className='text-base cursor-pointer md:text-lg '
            htmlFor='by-cash'
          >
            Thanh toán tiền mặt khi nhận hàng
          </Label>
        </div>
        <div data-cy='payment-method' className='flex items-center space-x-2'>
          <RadioGroupItem value={PAYMENT_METHOD.MOMO} id='momo' />
          <Label
            className='text-base cursor-pointer md:text-lg '
            htmlFor='momo'
          >
            Ví momo (freeship từ đơn hàng 150.000Đ)
          </Label>
        </div>
        <div data-cy='payment-method' className='flex items-center space-x-2'>
          <RadioGroupItem
            value={PAYMENT_METHOD.CREDIT_TRANSFER}
            id='credit-transfer'
          />
          <Label
            className='text-base cursor-pointer md:text-lg '
            htmlFor='credit-transfer'
          >
            Chuyển khoản ngân hàng (freeship từ đơn hàng 150.000Đ)
          </Label>
        </div>
      </RadioGroup>
      <button
        onClick={() => {
          checkoutWithMomo({
            orderId: "6621f409dd4200686c411db0",
            amount: "10000",
            items:[{currency:'VND',id:"d83jiji232",name:'Mangosteen',price:40000,quantity:1,imageUrl:"https://images.pexels.com/photos/2132031/pexels-photo-2132031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}],
            deliveryInfo: {
              deliveryAddress: "42 Duong So 8",
              deliveryFee: "0",
              quantity: "1",
            },
          });
        }}
      >
        Checkout
      </button>
    </div>
  );
};

export default CheckoutPaymentMethods;
