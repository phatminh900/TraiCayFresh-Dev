import { cookies } from 'next/headers';
import CartList from '@/components/molecules/cart-list'
import PageSubTitle from '@/components/ui/page-subTitle'
import { getCartOfUser } from '@/services/cart.service';
import { getUserServer } from '@/services/server/auth.service';

const CheckoutListCart =async () => {
  const nextCookies = cookies();
 const user=await getUserServer(nextCookies)
  const userCart = await getCartOfUser(nextCookies);
  return (
    <div>
        <PageSubTitle>Sản phẩm</PageSubTitle>
        <CartList user={user || undefined} userCart={userCart} />
    </div>
  )
}

export default CheckoutListCart