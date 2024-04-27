"use client";
import {
  HOST_PHONE_NUMBER,
  ORDER_ID_LENGTH,
} from "@/constants/configs.constant";
import { cn } from "@/lib/utils";
import { Order } from "@/payload/payload-types";
import { formatPriceToVND } from "@/utils/util.utls";
import { BsFillBagXFill } from "react-icons/bs";
import { IoBagCheck } from "react-icons/io5";
import CancelOrderRequest from "./cancel-order-request";
import { useState, FormEvent } from "react";
import FeedbackBox from "./feedback-box";
import OrderStatusTitleInfo from "./order-status-title-info";

interface OrderStatusInfoProps {
  orderId: string;
  shippingAddress: Order["shippingAddress"];
  totalPrice: number;
  orderStatus: Order["status"];
  deliveryStatus: Order["deliveryStatus"];
  orderNotes?: Order["orderNotes"];
}
const OrderStatusInfo = ({
  orderId,
  shippingAddress,
  totalPrice,
  orderNotes,
  deliveryStatus,
  orderStatus,
}: OrderStatusInfoProps) => {
  const [isOpenCancelRequest, setIsOpenCancelRequest] = useState(false);
  const toggleOpenCancelRequest = () => setIsOpenCancelRequest((prev) => !prev);
  // TODO: IPNURL
  // TODO: pullIsPaid useQuery (enable:isPaid===false,refetchInterval)

  return (
    <div className='mt-8'>
      <div
        data-cy='title-box-order-status'
        className={cn("font-bold text-2xl", {
          "text-primary":
            orderStatus === "confirmed" || orderStatus === "pending",
          "text-destructive":
            orderStatus === "failed" || orderStatus === "canceled",
        })}
      >
        <div className='flex items-center flex-col justify-center gap-3 text-center mb-4'>
          <OrderStatusTitleInfo orderStatus={orderStatus} />
        </div>
      </div>
      <div className='py-2 px-3 space-y-2 mt-6 bg-gray-200 rounded-md border border-gray-800'>
        <div className='flex justify-between'>
          {/* get only the last ten characters of the id */}
          <p data-cy='order-status-id'>
            Đơn hàng: <span>#{orderId.slice(-ORDER_ID_LENGTH)}</span>
          </p>
          {orderStatus === "pending" && deliveryStatus === "pending" && (
            <CancelOrderRequest
              orderId={orderId}
              isOpen={isOpenCancelRequest}
              onToggleOpenCancelRequest={toggleOpenCancelRequest}
            />
          )}
        </div>
        <div>
          <p data-cy='user-info-order-status'>
            Người nhận:{" "}
            <span className='font-bold'>
              {shippingAddress.userName} - {shippingAddress.userPhoneNumber}
            </span>{" "}
          </p>
        </div>
        <div>
          <p data-cy='shipping-address-order-status'>
            Địa chỉ nhận hàng: <span>{shippingAddress.address}</span>
          </p>
        </div>
        <div>
          <p data-cy='total-cost-order-status'>
            Tổng tiền:{" "}
            <span className='text-destructive font-semibold'>
              {formatPriceToVND(totalPrice)}
            </span>
          </p>
        </div>
        <div>
          <p data-cy='order-confirmation-status'>
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
              {orderStatus === "failed" && "Thất bại"}
              {orderStatus === "canceled" && "Đã hủy"}

            </span>
          </p>
        </div>
        {orderStatus === "confirmed" ||
          (orderStatus === "pending" && (
            <div>
              <p data-cy='delivery-status-order'>
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
          ))}
        {orderNotes && (
          <div>
            <p data-cy='notes-order'>
              Ghi chú: <span>{orderNotes}</span>
            </p>
          </div>
        )}
        <div>
          <p>
            Moị thắc mắc vui lòng liên hệ{" "}
            <a
              data-cy='zalo-order-status'
              className='font-bold'
              href='https://zalo.me/0985215845'
              target='_blank'
            >
              Zalo
            </a>{" "}
            hoặc gọi đến số{" "}
            <a
              data-cy='tel-order-status'
              className='font-bold'
              href={`tel:${HOST_PHONE_NUMBER}`}
            >
              {HOST_PHONE_NUMBER}
            </a>
          </p>
        </div>
      </div>
      <FeedbackBox />
    </div>
  );
};

export default OrderStatusInfo;
