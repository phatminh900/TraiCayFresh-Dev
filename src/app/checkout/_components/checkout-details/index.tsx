"use client";
import PageSubTitle from "@/components/ui/page-subTitle";
import { useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import { formatPriceToVND } from "@/utils/util.utls";
import { useEffect, useState } from "react";

interface CheckoutDetailsProps extends IUser {
  // total
}

const CheckoutDetails = ({ user }: CheckoutDetailsProps) => {
  const cartItems = useCart((store) => store.items);
  const totalPriceInit = user!.cart!.items!.reduce(
    (total, item) => total + item.totalPrice!,
    0
  );
  const priceAfterCouponInit = user!.cart!.items!.reduce((total, item) => {
    if (item?.priceAfterCoupon) {
      return total + item.priceAfterCoupon;
    }
    return total;
  }, 0);
  const [cartTotalPrice, setCartTotalPrice] = useState(totalPriceInit);
  const [decreasedAmount, setDecreasedAmount] = useState(totalPriceInit);
  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + (item.quantity*(item?.priceAfterDiscount||item.originalPrice)),
      0
    );
    setCartTotalPrice(totalPrice);
    if (priceAfterCouponInit) {
      const decreasedAmount = cartItems.reduce((total, item) => {
        if (item.discountAmount) {
          return total + (totalPrice* item.discountAmount/100)
        }
        return total;
      }, 0);
      setDecreasedAmount(decreasedAmount);
    }
  }, [cartItems, priceAfterCouponInit]);
  console.log(cartTotalPrice,priceAfterCouponInit)
  return (
    <div>
      <PageSubTitle>Chi tiết thanh toán</PageSubTitle>
      <div data-cy='payment-details-box space-y-2'>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p className='font-bold'>Tổng tiền thanh toán</p>
          <p>{formatPriceToVND(cartTotalPrice)}</p>
        </div>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p className='font-bold'>Giảm giá</p>
          <p className='text-primary font-semibold'>
            {decreasedAmount
              ? `-${formatPriceToVND( decreasedAmount)}`
              : 0}
          </p>
        </div>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p className='font-bold'>Phí vận chuyển</p>
          <p>0</p>
        </div>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between mt-2'
        >
          <p className='font-bold text-lg'>Thành tiền</p>
          <p className='text-destructive font-bold text-lg'>
            {formatPriceToVND(cartTotalPrice-decreasedAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;
