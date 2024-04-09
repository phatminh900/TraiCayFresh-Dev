"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart.store";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";

const PING_TIME_OUT = 3000;
let initial = true;

interface HeaderCartItemProps {
  cartLength: number;
}
const HeaderCartItem = ({ cartLength }: HeaderCartItemProps) => {
  const cartItems = useCart((state) => state.items);
  const cartItemLength =  cartItems.length;
  const [previousCartLength, setPreviousCartLength] = useState(cartItemLength);
  useEffect(() => {
    if (previousCartLength !== cartItemLength) {
      initial = false;
      const timer = setTimeout(() => {
        setPreviousCartLength(cartItemLength);
      }, PING_TIME_OUT);
      return () => clearTimeout(timer);
    }
  }, [cartItemLength, previousCartLength]);
  return (
    <>
      <IoCartOutline
        className={cn("w-7 h-7 text-gray-800 hover:text-gray-800")}
      />
      {cartItemLength > 0 && (
        <span className='absolute flex h-5 w-5 -right-[8px] -top-[6px]'>
          <span
          data-cy='cart-item-count-ping'
            className={cn(
              "absolute inline-flex h-full w-full rounded-full bg-destructive/80 opacity-75",
              {
                "animate-ping":
                  previousCartLength !== cartItemLength && !initial,
              }
            )}
          ></span>
          <span data-cy='cart-item-count' className='text-white relative inline-flex rounded-full h-5 w-5 bg-destructive/80 text-sm items-center justify-center'>
            {cartItemLength}
          </span>
        </span>
      )}
    </>
  );
};

export default HeaderCartItem;
