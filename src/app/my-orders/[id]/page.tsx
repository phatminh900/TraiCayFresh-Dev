import { notFound } from "next/navigation";
import {
  IoReceiptOutline,
  IoLocationOutline,
  IoCardOutline,
  IoBagHandleOutline,
} from "react-icons/io5";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload/orders.service";
import React from "react";
import moment from "moment";
import 'moment/locale/vi'
import { sliceOrderId } from "@/utils/util.utls";
import DeliveryStatus from "../__components/delivery-status";
moment.locale('vi')
const SpecificOrderPage = async ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  if (!orderId) notFound();
  console.log(params.id);
  const { data: order } = await getOrderStatus({ orderId });
  console.log('---------- no orders------')
  console.log(order)
  if (!order) return notFound();
  const orderDate = moment(order.createdAt).locale('vi');
  const formattedDate = orderDate.format("HH:mm , dddd , DD/MM/YYYY");
  console.log(formattedDate);

  return (
    <section>
      <BreadCrumbLinks
        deep={2}
        links={[
          { href: APP_URL.myOrders, label: "Đơn hàng đã mua" },
          {
            href: `${APP_URL.myOrders}/${orderId}`,
            label: "Chi tiết đơn hàng",
          },
        ]}
      />
      <PageTitle>Chi tiết đơn hàng</PageTitle>

      <div className='space-y-4 divide-y'>
        <div className='flex gap-3 bg-gray-50 shadow-sm py-4'>
          <IoReceiptOutline size={35} />
          <div className='flex flex-col'>
            <div className='font-bold sm:text-lg flex items-center justify-between'>
              <p>
                {" "}
                Đơn hàng:{" "}
                <span className='text-sm'>{sliceOrderId(orderId)}</span>
              </p>
              <div className='text-xs sm:text-base'>
                <DeliveryStatus deliveryStatus={order.deliveryStatus} />
              </div>
            </div>
            <p className="capitalize">
              Đặt lúc: <span>{formattedDate}</span>
            </p>
          </div>
        </div>
        <div>
          <div className='flex gap-3 bg-gray-50 shadow-sm py-4'>
            <IoLocationOutline size={35} />
            <div className='flex flex-col gap-2'>
              <p className='font-bold sm:text-lg'>Thông tin nhận hàng</p>
              <p className='font-bold'>
                {order.shippingAddress.userName} -{" "}
                {order.shippingAddress.userName}
              </p>
              <p>{order.shippingAddress.address}</p>
            </div>
          </div>
        </div>
        <div>
          <div className='flex gap-3 bg-gray-50 shadow-sm py-4'>
            <IoCardOutline size={35} />
            <div className='flex flex-col gap-2'>
              <p className='font-bold sm:text-lg'>Hình thức thanh toán</p>
              <p >
                {order.paymentMethod === "cash" && "Thanh toán bằng tiền mặt"}
                {order.paymentMethod === "momo" && "Thanh toán bằng MoMo"}
                {order.paymentMethod === "vnpay" && "Thanh toán bằng VnPay"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className='flex gap-3 bg-gray-50 shadow-sm py-4'>
            <IoBagHandleOutline size={35} />
            <div className='flex flex-col gap-2'>
              <p className='font-bold sm:text-lg'>Thông tin sản phẩm</p>
              <p className='font-bold'>
                {order.paymentMethod === "cash" && "Thanh toán bằng tiền mặt"}
                {order.paymentMethod === "momo" && "Thanh toán bằng MoMo"}
                {order.paymentMethod === "vnpay" && "Thanh toán bằng VnPay"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecificOrderPage;
