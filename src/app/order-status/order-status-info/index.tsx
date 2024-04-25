"use client";
import { HOST_PHONE_NUMBER } from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Order } from "@/payload/payload-types";
import { formatPriceToVND } from "@/utils/util.utls";
import { BsFillBagXFill } from "react-icons/bs";
import { IoBagCheck } from "react-icons/io5";
import CancelOrderRequest from "./cancel-order-request";
import { useState, FormEvent } from "react";
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
  const [isOpenCancelRequest, setIsOpenCancelRequest] = useState(false);
  const toggleOpenCancelRequest = () => setIsOpenCancelRequest((prev) => !prev);
  // TODO: IPNURL
  // TODO: pullIsPaid useQuery (enable:isPaid===false,refetchInterval)
  const orderSuccessEl = (
    <>
      <IoBagCheck size={35} className='text-primary' />
      <p>Đặt hàng thành công</p>
      <p className='text-base font-bold text-gray-800'>
        Cảm ơn bạn đã tin tưởng và đặt hàng. Chúng tôi sẽ sớm gửi ngay đơn hàng
        đến bạn.
      </p>
    </>
  );
  const orderFailedEl = (
    <>
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
    </>
  );
  return (
    <div className='mt-8'>
      <div
        className={cn("font-bold text-2xl", {
          "text-primary":
            orderStatus === "confirmed" || orderStatus === "pending",
          "text-destructive":
            orderStatus === "failed" || orderStatus === "canceled",
        })}
      >
        <div className='flex items-center flex-col justify-center gap-3 text-center mb-4'>
          {orderStatus === "confirmed" || orderStatus === "pending"
            ? orderSuccessEl
            : orderFailedEl}
        </div>
      </div>
      <div className='py-2 px-3 space-y-2 mt-4 bg-gray-200 rounded-md border border-gray-800'>
        <div className='flex justify-between'>
          <p>Đơn hàng: #{orderId}</p>
          {orderStatus === "pending" && (
            <CancelOrderRequest
              orderId={orderId}
              isOpen={isOpenCancelRequest}
              onToggleOpenCancelRequest={toggleOpenCancelRequest}
            />
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
            <span className='text-destructive font-semibold'>
              {formatPriceToVND(totalPrice)}
            </span>
          </p>
        </div>
        <div>
          <p>
            Trạng thái:{" "}
            <span
              className={cn({
                "text-primary": orderStatus === "confirmed",
                "text-accent": orderStatus === "pending",
                "text-destructive":
                  orderStatus === "canceled" || orderStatus == "failed",
              })}
            >
              {orderStatus === "pending" && "Đợi xác nhận"}
              {orderStatus === "confirmed" && "Thành công"}
              {orderStatus === "canceled" && "Thất bại"}
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
                "text-accent": deliveryStatus === "pending",
              })}
            >
              {deliveryStatus === "pending" && "Đang chuẩn bị hàng"}
              {deliveryStatus === "canceled" && "Giao hàng thất bai"}
              {deliveryStatus === "delivering" && "Đang giao hàng"}
              {deliveryStatus === "delivered" && "Đã giao hàng"}
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
            <a className='font-bold' href={`tel:${HOST_PHONE_NUMBER}`}>
              {HOST_PHONE_NUMBER}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusInfo;
