'use client'
import { Button } from '@/components/ui/button'
import { Customer } from '@/payload/payload-types'
import { useCart } from '@/store/cart.store'
import { formatPriceToVND } from '@/utils/util.utls'
import CartRequestLogin from './cart-request-login'

interface CartSummaryProps{
  user?:Customer
}
const CartSummary = ({user}:CartSummaryProps) => {
    const cartItems=useCart((store)=>store.items)
    const totalPrice=cartItems.reduce((total,item)=>total+(item.quantity*item.originalPrice),0)
  return (
    <div className='mt-10'>
        <div className='flex gap-2 flex-col'>
          <p className='font-semibold'>Tạm tính</p>
          <p data-cy='cart-summary-total' className='text-destructive font-semibold text-lg'>
            {formatPriceToVND(totalPrice)}
          </p>
        </div>
        {!user?<Button className='mt-4'>Thanh toán ngay</Button>:<CartRequestLogin/>}
      </div>
  )
}

export default CartSummary