
import { cookies } from "next/headers";
import CartList from "@/components/molecules/cart-list";
import PageSubTitle from "@/components/ui/page-subTitle";
import { getCartOfUser } from "@/services/server/payload.service";
import { getUserServer } from "@/services/server/auth.service";
import { isEmailUser } from "@/utils/util.utls";

const CheckoutListCart = async () => {
  const nextCookies = cookies();
  const user = await getUserServer(nextCookies);
  const userCartData =
    (await getCartOfUser(
      user && isEmailUser(user) ? "email" : "phoneNumber",
      user?.id
    )) || [];

   const userCart=userCartData.ok?userCartData.userCart:[]
  return (
    <div className="mt-8">
      <PageSubTitle>Sản phẩm</PageSubTitle>
      <CartList user={user || undefined} userCart={userCart!} />
    </div>
  );
};

export default CheckoutListCart;
