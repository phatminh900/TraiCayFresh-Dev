import React from 'react'
import OrderSpecificSectionWrapper from './order-specific-section-wrapper'
import { IoLocationOutline } from 'react-icons/io5'

interface OrderSpecificShippingAddressProps{
    userName:string,
    phoneNumber:string,
    address:string
}
const OrderSpecificShippingAddress = ({userName,phoneNumber,address}:OrderSpecificShippingAddressProps) => {
  return (
   <OrderSpecificSectionWrapper>
     <IoLocationOutline size={35} />
            <div className='flex flex-col gap-2'>
              <p className='font-bold sm:text-lg'>Thông tin nhận hàng</p>
              <p className='font-bold'>
                {userName} -{" "}
                {userName}
              </p>
              <p>{address}</p>
            </div>
    </OrderSpecificSectionWrapper>
  )
}

export default OrderSpecificShippingAddress