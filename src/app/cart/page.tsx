import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import PageTitle from "@/components/ui/page-title";
import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";
import { getCartOfUser } from "@/services/server/payload/carts.service";
import CartList from "@/components/molecules/cart-list";
// import CartList from "./_components/cart-list";
import CartSummary from "./_components/cart-summary";

export const dynamic = "force-dynamic";
const CartPage = async () => {
  const user = await getUserServer();
  
  const {data:userCart} = await getCartOfUser(user && 'email' in user?'email':'phoneNumber',user?.id);

  // const userCart=userCartData.ok?userCartData.userCart:[]

  return (
    <section>
      <BreadCrumbLinks links={[{ label: "Giỏ hàng", href: APP_URL.cart }]} />
      <PageTitle>Giỏ hàng của bạn</PageTitle>
      <CartList user={user || undefined} userCart={userCart!} />
      <CartSummary user={user} />
    </section>
  );
};

export default CartPage;
