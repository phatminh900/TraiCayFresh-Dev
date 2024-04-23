"use client";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { PAYMENT_METHOD } from "../checkout-client";

interface CheckoutPaymentMethodsProps {
  onSetPaymentMethod:(type:PAYMENT_METHOD)=>void
  method:PAYMENT_METHOD
}
const CheckoutPaymentMethods = ({method,onSetPaymentMethod}:CheckoutPaymentMethodsProps) => {

  return (
    <div>
      <PageSubTitle>Phương thức thanh toán</PageSubTitle>
      <RadioGroup
        data-cy='payment-method-box'
        className='mt-8'
        onValueChange={(value) => {
          onSetPaymentMethod(value as PAYMENT_METHOD)
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
       
      >
        Checkout
      </button>
    </div>
  );
};

export default CheckoutPaymentMethods;
