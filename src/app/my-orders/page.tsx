import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import EmptyCart from "@/components/molecules/empty-cart";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";

import { getUserOrders } from "@/services/server/payload/orders.service";
import OrderList from "./__components/order-list";
import { cookies } from "next/headers";

const MyOrderPage = async () => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  const { data } = await getUserOrders({ userId: user!.id });
  const orders = data?.orders;
  return (
    <>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myOrders, label: "Đơn hàng đã mua" }]}
      />
      <PageTitle>Đơn hàng đã mua</PageTitle>
      {!orders?.length ? (
        <EmptyCart message='Bạn chưa mua đơn hàng nào' />
      ) : (
        <OrderList
          initialOrders={orders}
          hasNextPage={data?.hasNextPage || false}
        />
      )}
    </>
  );
};

export default MyOrderPage;
