import React from "react";
import { MdAttachMoney } from "react-icons/md";
import OrderSpecificSectionWrapper from "./order-specific-section-wrapper";
import { formatPriceToVND } from "@/utils/util.utls";
import { Order } from "@/payload/payload-types";

interface OrderSpecificSummaryProps {
  total: number;
  shippingCost: number;
  totalAfterCoupon?: Order['totalAfterCoupon'];
  provisional:number
}
const OrderSpecificSummary = ({
  total,
  shippingCost,
  totalAfterCoupon,
  provisional
}: OrderSpecificSummaryProps) => {
  return (
    <OrderSpecificSectionWrapper className='text-lg'>
      <MdAttachMoney size={35} />
      <div data-cy="order-summary-box" className='flex flex-col gap-2 flex-1'>
        <p data-cy="title-box" className='font-bold sm:text-lg'>Tóm tắt chi phí</p>
        <div className='space-y-2'>
          <div data-cy="provisional-price"  className='text-gray-700 font-semibold flex items-center justify-between'>
            <p className='text-sm'>Tổng tiền sản phẩm</p>
            <p className='text-xs font-medium'>{formatPriceToVND(provisional)}</p>
          </div>
          { (totalAfterCoupon) ? (
            <div data-cy="price-after-coupon" className='text-gray-700 font-semibold flex items-center justify-between'>
              <p className='text-sm'>Giảm giá</p>
              <p className='text-xs font-medium text-primary'>-{formatPriceToVND(provisional-totalAfterCoupon)}</p>
            </div>
          ):null}
          <div data-cy="shipping-free" className='text-gray-700 font-semibold flex items-center justify-between'>
            <p className='text-sm'>Phí vận chuyển</p>
            <p className='text-xs font-medium'>{formatPriceToVND(shippingCost)}</p>
          </div>
          <div  data-cy="final-price" className='font-bold flex items-center text-lg justify-between mt-2'>
            <p>Tổng cộng</p>
            <p className="text-lg text-destructive">{formatPriceToVND(total)}</p>
          </div>
        </div>
      </div>
    </OrderSpecificSectionWrapper>
  );
};

export default OrderSpecificSummary;
