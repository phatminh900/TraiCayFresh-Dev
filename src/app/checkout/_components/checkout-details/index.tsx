"use client";
import PageSubTitle from "@/components/ui/page-subTitle";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart.store";
import { formatPriceToVND } from "@/utils/util.utls";
import { memo } from 'react';

const CheckoutDetails = () => {
  const cartItems = useCart((store) => store.items);
  const cartTotalPrice = cartItems.reduce(
    (total, item) =>
      total + item.quantity * (item.priceAfterDiscount || item.originalPrice),
    0
  );
  const saleAmount = cartItems.reduce((total, item) => {
    if (item.discountAmount) {
      return (
        total +
        (item.discountAmount *
          item.quantity *
          (item.priceAfterDiscount || item.originalPrice)) /
          100
      );
    }
    return total;
  }, 0);
  return (
    <div>
      <PageSubTitle>Chi tiết thanh toán</PageSubTitle>
      <div data-cy='payment-details-box' className='space-y-2'>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p data-cy='payment-detail-title' className='font-bold'>
          Tổng tiền sản phẩm
          </p>
          <p data-cy='payment-detail-value'>{formatPriceToVND(cartTotalPrice)}</p>
        </div>
        {Boolean(saleAmount) && <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p data-cy='payment-detail-title' className='font-bold'>
            Giảm giá
          </p>
          <p data-cy='payment-detail-value' className={cn('font-semibold',{
            'text-primary':saleAmount
          })}>
            {saleAmount ? `-${formatPriceToVND(saleAmount)}` : 0}
          </p>
        </div>}
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between'
        >
          <p data-cy='payment-detail-title' className='font-bold'>
            Phí vận chuyển
          </p>
          <p data-cy='payment-detail-value' >0</p>
        </div>
        <div
          data-cy='payment-detail'
          className='flex items-center justify-between mt-2'
        >
          <p data-cy='payment-detail-title' className='font-bold text-xl'>
            Thành tiền
          </p>
          <p data-cy='payment-detail-value' className='text-destructive font-bold text-xl mt-2'>
            {formatPriceToVND(cartTotalPrice - saleAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(CheckoutDetails);
