import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { buttonVariants } from "@/components/ui/button";
import { APP_PARAMS, APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import OrderStatusInfo from "./order-status-info";
import PageTitle from "@/components/ui/page-title";

const OrderStatus = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  
  const orderId = searchParams[APP_PARAMS.cartOrderId];
  if (!orderId) notFound();
  const orderData = await getOrderStatus({ orderId });
  const order = orderData?.order;
  let content = (
    <div className='text-center'>
      <p className='font-bold mb-2 text-lg'>
        Không có đơn hàng nào với mã số này!
      </p>
      <Link className={buttonVariants({ variant: "link" })} href={APP_URL.home}>
        Trờ về trang chủ
      </Link>
    </div>
  );
  if (order) {
    content = (
      <OrderStatusInfo
        shippingAddress={order.shippingAddress}
        deliveryStatus={order.deliveryStatus}
        orderId={order.id}
        orderStatus={order.status}
        totalPrice={order.total}
      />
    );
  }
  return (
    <div>
      <BreadCrumbLinks
        links={[{ label: "Trạng thái đơn hàng", href: APP_URL.orderStatus }]}
      />
      <PageTitle>Trạng thái đơn hàng</PageTitle>
      {content}
    </div>
  );
};

export default OrderStatus;
