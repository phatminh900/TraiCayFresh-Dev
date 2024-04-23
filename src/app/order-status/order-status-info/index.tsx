"use client";
import { IoBagCheck } from "react-icons/io5";
import { BsFillBagXFill } from "react-icons/bs";
import { HOST_PHONE_NUMBER } from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Order } from "@/payload/payload-types";
import React from "react";
import { formatPriceToVND } from '@/utils/util.utls';
import { useCart } from "@/store/cart.store";
interface OrderStatusInfoProps {
  orderId: string;
  shippingAddress: Order["shippingAddress"];
  totalPrice: number;
  orderStatus: Order["status"];
  deliveryStatus: Order["deliveryStatus"];
}
const OrderStatusInfo = ({
  orderId,
  shippingAddress,
  totalPrice,
  deliveryStatus,
  orderStatus,
}: OrderStatusInfoProps) => {
  const orderSuccessEl = (
    <div className='space-y-3'>
      <div className='flex items-center gap-3'>
        <IoBagCheck size={35} className='text-primary' />
        <p>Đặt hàng thành công</p>
      </div>
      <p className='text-base font-bold text-gray-800'>
        Cảm ơn bạn đã tin tưởng và đặt hàng. Chúng tôi sẽ sớm gửi ngay đơn hàng
        đến bạn.
      </p>
    </div>
  );
  const orderFailedEl = (
    <div className='flex items-center gap-3'>
      <BsFillBagXFill size={35} className='text-destructive' />
      <p>Đặt hàng thất bại</p>
      {orderStatus === "failed" && (
        <p className='text-base font-bold text-gray-800'>
          Cảm ơn bạn đã tin tưởng và đặt hàng. Nhưng vì lý do nào đó đơn hàng đã
          đặt không thành công. Xin lỗi về sự bất tiện này , mong bạn đặt lại
          đơn hàng sau ít phút.{" "}
        </p>
      )}
      {orderStatus === "canceled" && (
        <p className='text-base font-bold text-gray-800'>
          Cảm ơn bạn đã ghé thăm{" "}
          <span className='font-bold'>Trái Cây Fresh</span>.
        </p>
      )}
    </div>
  );
  return (
    <div className='mt-4'>
      <div
        className={cn("font-bold text-2xl", {
          "text-primary":
            orderStatus === "confirmed" || orderStatus === "pending",
          "text-destructive":
            orderStatus === "failed" || orderStatus === "canceled",
        })}
      >
        {(orderStatus === "confirmed" ||orderStatus==='pending')? orderSuccessEl : orderFailedEl}
      </div>
      <div className='py-2 px-3 space-y-2 mt-4 bg-gray-200 rounded-md border border-gray-800'>
        <div className='flex justify-between'>
          <p>Đơn hàng: #{orderId}</p>
          {orderStatus === "pending" && (
            <button className='text-destructive font-bold'>Hủy</button>
          )}
        </div>
        <div>
          <p>
            Người nhận:{" "}
            <span className='font-bold'>
              {shippingAddress.userName} - {shippingAddress.userPhoneNumber}
            </span>{" "}
          </p>
        </div>
        <div>
          <p>Địa chỉ nhận hàng: {shippingAddress.address}</p>
        </div>
        <div>
          <p>
            Tổng tiền:{" "}
            <span className='text-destructive font-semibold'>{formatPriceToVND(totalPrice)}</span>
          </p>
        </div>
        <div>
          <p>
            Trạng thái:{" "}
            <span
              className={cn({
                "text-primary": orderStatus === "confirmed",
                "text-secondary": orderStatus === "pending",
                "text-destructive":
                  orderStatus === "canceled" || orderStatus == "failed",
              })}
            >
              {orderStatus==='pending' && "Đợi xác nhận"}
              {orderStatus==='confirmed' && "Thành công"}
              {orderStatus==='canceled' && "Thất bại"}

            </span>
          </p>
        </div>
        <div>
          <p>
            Tình trạng đơn hàng:{" "}
            <span
              className={cn({
                "text-primary":
                  deliveryStatus === "delivered" ||
                  deliveryStatus === "delivering",
                "text-destructive": deliveryStatus === "canceled",
                "text-secondary": deliveryStatus === "pending",
              })}
            >
              {deliveryStatus}
            </span>
          </p>
        </div>
        <div>
          <p>
            Moị thắc mắc vui lòng liên hệ{" "}
            <a
              className='font-bold'
              href='https://zalo.me/0985215845'
              target='_blank'
            >
              Zalo
            </a>{" "}
            hoặc gọi đến số{" "}
            <a href={`tel:${HOST_PHONE_NUMBER}`}>{HOST_PHONE_NUMBER}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusInfo;
