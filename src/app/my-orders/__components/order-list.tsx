"use client";
import { Order } from "@/payload/payload-types";
import { useCallback, useState } from "react";
import LoadOrderBtn from "./load-order-btn";
import OrderItem from "./order-item";

interface OrderListProps{
  initialOrders:Order[],
  hasNextPage:boolean
}
const OrderList = ({hasNextPage,initialOrders}:OrderListProps) => {
  const [userOrders, setUserOrders] = useState<Order[]>(initialOrders);
  const handleLoadOrder = useCallback((orders: Order[]) => {
    setUserOrders((prev) => [...prev, ...orders]);
  }, []);



  return (
    <ul className='space-y-6'>
      {userOrders?.map((order) => (
        <OrderItem
          key={order.id}
          items={order.items}
          deliveryStatus={order.deliveryStatus}
        orderId={order.id}
          totalPrice={order.total}
        />
      ))}
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          
        <LoadOrderBtn  onSetOrder={handleLoadOrder} currentOrders={userOrders} />
        </div>
      )}
    </ul>
  );
};

export default OrderList;
