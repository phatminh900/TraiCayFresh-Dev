"use client";
import {
  AMOUNT_PER_ADJUST_QUANTITY,
  EXCESS_QUANTITY_OPTION_MESSAGE,
  MAXIMUN_KG_CAN_BUY_THROUGH_WEB,
} from "@/constants/constants.constant";
import { APP_URL } from "@/constants/navigation.constant";
import type { Product } from "@/payload/payload-types";
import { useCart } from "@/store/cart.store";
import { formatPriceToVND, getImgUrlMedia } from "@/utils/util.utls";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { IoAddOutline, IoRemoveOutline, IoTrashOutline } from "react-icons/io5";
import { toast } from "sonner";

interface CartItemProps {
  src: Product["thumbnailImg"];
  title: string;
  originalPrice: number;
  price: number;
  quantity: number;
  id: string;
}
const CartItem = ({
  id,
  src,
  title,
  originalPrice,
  price,
  quantity,
}: CartItemProps) => {
  const router = useRouter();
  const updateCartItem = useCart((state) => state.updateItem);
  const removeCartItem = useCart((state) => state.removeItem);

  const [curQuantity, setCurQuantity] = useState(quantity);
  const handleDecreaseQuantity = (e:MouseEvent) => {
    e.preventDefault()
    if (curQuantity === 0.5) return;
    const updatedQuantity = curQuantity - AMOUNT_PER_ADJUST_QUANTITY;
    setCurQuantity(updatedQuantity);
    updateCartItem({ id, data: { quantity: updatedQuantity } });
  };
  const handleIncreaseQuantity = (e:MouseEvent) => {
    e.preventDefault()
    if (curQuantity === MAXIMUN_KG_CAN_BUY_THROUGH_WEB)
      return toast.warning(EXCESS_QUANTITY_OPTION_MESSAGE);
    const updatedQuantity = curQuantity + AMOUNT_PER_ADJUST_QUANTITY;
    setCurQuantity(updatedQuantity);
    updateCartItem({ id, data: { quantity: updatedQuantity } });
  };
  const handleRemoveCartItem = (e:MouseEvent) => {
    e.preventDefault()
    removeCartItem(id);
    router.refresh();
  };
  const imgSrc = getImgUrlMedia(src);

  // TODO: loading...
  return (
    <li
      data-cy='cart-item'
      className='border border-gray-200 h-28 shadow-lg rounded-md overflow-hidden'
    >
      <Link className="flex w-full h-full" href={`${APP_URL.products}/${id}`}>
      <div className='relative w-[30%] min-w-[30%] aspect-square overflow-hidden'>
        <Image
          fill
          className='object-center object-cover'
          src={imgSrc || ""}
          alt='Product Img'
        />
      </div>
      <div className='w-full flex px-3 py-2 justify-between'>
        <div className='flex flex-col justify-between'>
          <p className='font-bold'>{title}</p>
          <div>
            {originalPrice && (
              <p className='text-destructive line-through text-sm'>
                {formatPriceToVND(price)}
              </p>
            )}
            <p className='text-destructive font-bold text-lg'>
              {formatPriceToVND(price)}
            </p>
          </div>
        </div>
        <div className='flex flex-col items-end justify-between'>
          <button
            data-cy='delete-btn-cart-item'
            onClick={handleRemoveCartItem}
            className='hover:scale-105'
          >
            <IoTrashOutline size={30} className='text-destructive' />
          </button>
          <div className='rounded-md border border-gray-200 h-[35px] flex items-center'>
            <button
              data-cy='decrease-quantity-btn-cart-item'
              onClick={handleDecreaseQuantity}
              className='border-r border-r-gray-400 p-1 flex h-full items-center justify-center hover:bg-gray-100'
            >
              <IoRemoveOutline />
            </button>
            <p className='p-2 font-bold flex-1'>{curQuantity}KG</p>
            <button
              data-cy='increase-quantity-btn-cart-item'
              onClick={handleIncreaseQuantity}
              className='border-l border-l-gray-400 p-1 flex h-full items-center justify-center hover:bg-gray-100'
            >
              <IoAddOutline />
            </button>
          </div>
        </div>
      </div></Link>
    </li>
  );
};

export default CartItem;
