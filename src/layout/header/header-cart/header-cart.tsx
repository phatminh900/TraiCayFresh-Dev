import { APP_URL } from "@/constants/navigation.constant";
import Link from "next/link";
import HeaderCartItem from "./header-cart-item";
import { cookies } from "next/headers";
import { getCartOfUser } from "@/services/server/cart.service";
import { getUserServer } from "@/services/server/auth.service";


export const dynamic = "force-dynamic";

const HeaderCart = async () => {
  const nextCookies = cookies();
  const user=await getUserServer(nextCookies)
  const userCart = await getCartOfUser(user && 'email' in user?'email':'phoneNumber',user?.id)||[];

  return (
    <Link data-cy='header-cart-link' href={APP_URL.cart} className='relative'>
      <HeaderCartItem cartLength={userCart.length} />
    </Link>
  );
};

export default HeaderCart;
