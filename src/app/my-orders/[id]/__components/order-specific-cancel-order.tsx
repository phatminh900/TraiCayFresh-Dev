'use client'
import CancelOrderRequest from '@/components/molecules/cancel-order-request'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/trpc-client'
import { handleTrpcErrors } from '@/utils/error.util'
import { handleTrpcSuccess } from '@/utils/success.util'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
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
    <CancelOrderRequest btnClassName='my-4 w-full' btnVariant={{variant:'destructive'}}    orderId={orderId} isOpen={isOpenCancelOrderRequest} onToggleOpenCancelRequest={handleToggleOpenState} />
    </>
  )
}

export default OrderSpecificCancelOrder