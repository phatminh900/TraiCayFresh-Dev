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
      <div className='flex flex-col gap-2 flex-1'>
        <p className='font-bold sm:text-lg'>Tóm tắt chi phí</p>
        <div className='space-y-2'>
          <div className='text-gray-700 font-semibold flex items-center justify-between'>
            <p className='text-sm'>Tổng tiền sản phẩm</p>
            <p className='text-xs font-medium'>{formatPriceToVND(provisional)}</p>
          </div>
          { (totalAfterCoupon) ? (
            <div className='text-gray-700 font-semibold flex items-center justify-between'>
              <p className='text-sm'>Giảm giá</p>
              <p className='text-xs font-medium text-primary'>-{formatPriceToVND(provisional-totalAfterCoupon)}</p>
            </div>
          ):null}
          <div className='text-gray-700 font-semibold flex items-center justify-between'>
            <p className='text-sm'>Phí vận chuyển</p>
            <p className='text-xs font-medium'>{formatPriceToVND(shippingCost)}</p>
          </div>
          <div className='font-semibold flex items-center justify-between mt-2'>
            <p>Tổng cộng</p>
            <p className="text-lg text-destructive">{formatPriceToVND(total)}</p>
          </div>
        </div>
      </div>
    </OrderSpecificSectionWrapper>
  );
};

export default OrderSpecificSummary;
