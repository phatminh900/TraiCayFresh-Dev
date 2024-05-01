import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getOrderStatus } from "@/services/server/payload/orders.service";
import { notFound } from "next/navigation";

import OrderSpecificDetails from "./__components/order-specific-details";
import OrderSpecificPayment from "./__components/order-specific-payment";
import OrderSpecificProducts from "./__components/order-specific-products";
import OrderSpecificShippingAddress from "./__components/order-specific-shipping-address";
import OrderSpecificSummary from "./__components/order-specific-sumary";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import OrderSpecificCancelOrder from "./__components/order-specific-cancel-order";
import FeedbackBox from "@/components/molecules/feed-back-box";
const SpecificOrderPage = async ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  if (!orderId) notFound();
  const { data: order } = await getOrderStatus({ orderId });
  if (!order) return notFound();

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
        <OrderSpecificDetails
          deliveryStatus={order.deliveryStatus}
          createdAt={order.createdAt}
          orderId={order.id}
        />
        <OrderSpecificShippingAddress
          address={order.shippingAddress.address}
          phoneNumber={order.shippingAddress.userPhoneNumber}
          userName={order.shippingAddress.userName}
        />
        <OrderSpecificPayment paymentMethod={order.paymentMethod} />
        <OrderSpecificProducts items={order.items} />
        <OrderSpecificSummary
          totalAfterCoupon={order.totalAfterCoupon}
          shippingCost={order.shippingFee}
          total={order.total}
          provisional={order.provisional}
        />
      </div>
      <div className='mt-8'>
        {order.status === "pending" && order.deliveryStatus === "pending" && (
          <OrderSpecificCancelOrder orderId={orderId} />
        )}
        <Link
          href={APP_URL.myOrders}
          className={buttonVariants({
            variant: "outline",
            className: " w-full",
          })}
        >
          Trở về danh sách đơn hàng
        </Link>
      </div>
      <FeedbackBox />
    </section>
  );
};

export default SpecificOrderPage;
