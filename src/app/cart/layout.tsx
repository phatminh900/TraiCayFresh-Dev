import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";
import { ReactNode } from "react";

const CartLayout = async ({ children }: { children: ReactNode }) => {
await   getUserServer();
  return (
    <section>
      <BreadCrumbLinks links={[{ label: "Giỏ hàng", href: APP_URL.cart }]} />
      <PageTitle>Giỏ hàng của bạn</PageTitle>
      {children}
    </section>
  );
};

export default CartLayout;
