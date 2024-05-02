'use client'
import CancelOrderRequest from '@/components/molecules/cancel-order-request'
import { useState } from 'react'
interface OrderSpecificCancelOrderProps{
    orderId:string
}
const OrderSpecificCancelOrder = ({orderId}:OrderSpecificCancelOrderProps) => {
    const [isOpenCancelOrderRequest,setIsOpenCancelOrderRequest]=useState(false)
   
    const handleToggleOpenState=()=>{
      setIsOpenCancelOrderRequest(prev=>!prev)
    }
  return (
    <>
    <CancelOrderRequest btnTitle='Hủy đơn hàng' btnClassName='my-4 w-full' btnVariant={{variant:'destructive'}}    orderId={orderId} isOpen={isOpenCancelOrderRequest} onToggleOpenCancelRequest={handleToggleOpenState} />
    </>
  )
}

export default OrderSpecificCancelOrder