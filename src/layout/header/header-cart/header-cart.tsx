import { APP_URL } from "@/constants/navigation.constant";
import { getUserServer } from "@/services/server/payload/users.service";

import { getCartOfUser } from "@/services/server/payload/carts.service";

import Link from "next/link";
import HeaderCartItem from "./header-cart-item";


export const dynamic = "force-dynamic";

const HeaderCart = async () => {
  const user=await getUserServer()
  const {data:userCart} = await getCartOfUser(user && 'email' in user?'email':'phoneNumber',user?.id)||[];
  return (
    <Link data-cy='header-cart-link' href={APP_URL.cart} className='relative'>
      <HeaderCartItem cartLength={userCart!.length} />
    </Link>
  );
};

export default HeaderCart;
