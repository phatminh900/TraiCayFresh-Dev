import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserOrders } from "@/services/server/payload/orders.service";
import { getUserServer } from "@/services/server/payload/users.service";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const MyOrderLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUserServer();
  if (!user) redirect(APP_URL.login);
  await getUserOrders({ userId: user!.id });
  return (
    <section>
      <BreadCrumbLinks
        deep={1}
        links={[{ href: APP_URL.myOrders, label: "Đơn hàng đã mua" }]}
      />
      <PageTitle>Đơn hàng đã mua</PageTitle>
      {children}
    </section>
  );
};

export default MyOrderLayout;
