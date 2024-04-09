import { APP_URL } from "@/constants/navigation.constant";
import Link from "next/link";
import HeaderCartItem from "./header-cart-item";
import { cookies } from "next/headers";
import { getCartOfUser } from "@/services/cart.service";


export const dynamic = "force-dynamic";

const HeaderCart = async () => {
  const nextCookies = cookies();
  const userCartData = await getCartOfUser(nextCookies);
  return (
    <Link data-cy='header-cart-link' href={APP_URL.cart} className='relative'>
      <HeaderCartItem cartLength={userCartData.length} />
    </Link>
  );
};

export default HeaderCart;
