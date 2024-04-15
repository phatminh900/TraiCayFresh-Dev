'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

enum PAYMENT_METHOD{
    "BY_CASH"="BY_CASH",
    "MOMO"="MOMO",
    "CREDIT_TRANSFER"= "CREDIT_TRANSFER"
}

const CheckoutPaymentMethods = () => {
    const [method,setMethod]=useState<PAYMENT_METHOD>(PAYMENT_METHOD.BY_CASH)
  return (
    <RadioGroup data-cy="payment-method-box" className="mt-8" onValueChange={(value)=>{
        setMethod(value as  PAYMENT_METHOD)
    }} defaultValue={method}>
    <div data-cy="payment-method" className="flex items-center space-x-2">
      <RadioGroupItem value={PAYMENT_METHOD.BY_CASH} id="by-cash" />
      <Label className='text-base md:text-lg ' htmlFor="by-cash">Thanh toán tiền mặt khi nhận hàng</Label>
    </div>
    <div data-cy="payment-method" className="flex items-center space-x-2">
      <RadioGroupItem value={PAYMENT_METHOD.MOMO} id="momo" />
      <Label className='text-base md:text-lg ' htmlFor="momo">Ví momo (freeship từ đơn hàng 150.000Đ)</Label>
    </div>
    <div data-cy="payment-method" className="flex items-center space-x-2">
      <RadioGroupItem value={PAYMENT_METHOD.CREDIT_TRANSFER} id="credit-transfer" />
      <Label className='text-base md:text-lg ' htmlFor="credit-transfer">Chuyển khoản ngân hàng (freeship từ đơn hàng 150.000Đ)</Label>
    </div>
  </RadioGroup>
  )
}

export default CheckoutPaymentMethods