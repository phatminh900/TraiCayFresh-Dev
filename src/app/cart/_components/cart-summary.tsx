"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";
import { formatPriceToVND } from "@/utils/util.utls";
import CartRequestLogin from "./cart-request-login";

interface CartSummaryProps extends IUser {}
const CartSummary = ({ user }: CartSummaryProps) => {
  const cartItems = useCart((store) => store.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.quantity * item.originalPrice,
    0
  );
  const [isOpenLoginRequest, setIsOpenLoginRequest] = useState(false);

  return (
    <div className='mt-10'>
      <div className='flex gap-2 flex-col'>
        <p className='font-semibold'>Tạm tính</p>
        <p
          data-cy='cart-summary-total'
          className='text-destructive font-semibold text-lg'
        >
          {formatPriceToVND(totalPrice)}
        </p>
      </div>
      {user ? (
        <Button className='mt-4'>Thanh toán ngay</Button>
      ) : (
        <CartRequestLogin
          isOpen={isOpenLoginRequest}
          handleClose={() => setIsOpenLoginRequest(false)}
          handleOpen={() => setIsOpenLoginRequest(true)}
        />
      )}
    </div>
  );
};

export default CartSummary;
