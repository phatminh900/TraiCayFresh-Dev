'use client'
import React from "react";
import OrderSpecificSectionWrapper from "./order-specific-section-wrapper";
import { IoBagHandleOutline } from "react-icons/io5";
import { Order, Product } from "@/payload/payload-types";
import Image from "next/image";
import { formatPriceToVND, getImgUrlMedia } from "@/utils/util.utls";
import Link from "next/link";
import { APP_URL } from "@/constants/navigation.constant";

interface OrderSpecificProductsProps {
  items: Order["items"];
}
const OrderSpecificProducts = ({ items }: OrderSpecificProductsProps) => {
  console.log(items)
  return (
    <OrderSpecificSectionWrapper>
      <IoBagHandleOutline size={35} />
      <div className='flex flex-col gap-2 flex-1'>
        <p className='font-bold sm:text-lg'>Thông tin sản phẩm</p>
        <ul className="mt-6 space-y-4">
          {items.map((item) => {
            const product = item.product as Product;
            const imgSrc = getImgUrlMedia(product.thumbnailImg);
            return (
              <OrderSpecificProduct
              key={item.id}
              productId={product.id}
              title={product.title}
                price={item.price}
                originalPrice={item.originalPrice}
                quantity={item.quantity}
                imgSrc={imgSrc!}
              />
            );
          })}
        </ul>
      </div>
    </OrderSpecificSectionWrapper>
  );
};

export default OrderSpecificProducts;

interface OrderSpecificProductProps {
  imgSrc: string;
  price: number;
  quantity: number;
  title:string,
  productId:string
  originalPrice?: Order["items"][number]["originalPrice"];
}
function OrderSpecificProduct({
  imgSrc,
  price,
  productId,
  quantity,
  title,
  originalPrice,
}: OrderSpecificProductProps) {
  return (
    <li className='h-20 shadow-sm'>
      <Link href={`${APP_URL.products}/${productId}`} className="h-full w-full flex">
      <div className='flex-1 flex gap-2'>
        <div className='relative w-[40%] min-w-[40%] aspect-square overflow-hidden'>
          <Image
            fill
            className='object-center object-cover'
            src={imgSrc || ""}
            alt='Product Img'
          />
        </div>
        <p>{title}</p>
      </div>
      <div className='flex flex-col justify-between items-end text-end'>
        <div>
          <p className='text-destructive font-semibold'>{formatPriceToVND(price)}</p>
          {/* if has original price but different that means the price has been reduced */}
          {originalPrice && originalPrice!==price && (
            <p className='text-sm line-through'>
              {formatPriceToVND(originalPrice)}
            </p>
          )}
        </div>
        <p className="text-sm">
          Số lương: <span>{quantity}Kg</span>
        </p>
      </div>
      </Link>
    </li>
  );
}
