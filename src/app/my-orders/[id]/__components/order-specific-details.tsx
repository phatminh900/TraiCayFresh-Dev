import React from 'react'
import moment from "moment";
import 'moment/locale/vi'
import OrderSpecificSectionWrapper from './order-specific-section-wrapper'
import { IoReceiptOutline } from 'react-icons/io5'
import DeliveryStatus from '../../__components/delivery-status'
import { Order } from '@/payload/payload-types'
import { sliceOrderId } from '@/utils/util.utls';
moment.locale('vi')

interface OrderSpecificDetailsProps{
    orderId:string,
    deliveryStatus:Order['deliveryStatus'],
    createdAt:Order['createdAt']
}
const OrderSpecificDetails = ({orderId,deliveryStatus,createdAt}:OrderSpecificDetailsProps) => {
    const orderDate = moment(createdAt).locale('vi');
    const formattedDate = orderDate.format("HH:mm , dddd , DD/MM/YYYY");
  return (
 <OrderSpecificSectionWrapper>
    <IoReceiptOutline size={35} />
          <div className='flex flex-col'>
            <div className='font-bold sm:text-lg flex items-center justify-between'>
              <p>
                {" "}
                Đơn hàng:{" "}
                <span className='text-sm'>{sliceOrderId(orderId)}</span>
              </p>
              <div className='text-xs sm:text-base'>
                <DeliveryStatus deliveryStatus={deliveryStatus} />
              </div>
            </div>
            <p className="capitalize">
              Đặt lúc: <span>{formattedDate}</span>
            </p>
          </div>
 </OrderSpecificSectionWrapper>
  )
}

export default OrderSpecificDetails