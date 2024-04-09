"use client";
import Image from "next/image";
import Link from "next/link";
import { IoBagAddOutline } from "react-icons/io5";
import useAddToCart from "@/hooks/use-add-to-cart";
import { formatPriceToVND } from "@/utils/util.utls";
import { Button } from "../ui/button";
import ReviewRating from "../ui/review-rating/review-rating";
import { Customer } from "@/payload/payload-types";

interface ProductItemProps {
  type?: "horizontal" | "vertical";
  title: string;
  subTitle?: string;
  src: string;
  id: string;
  href: string;
  originalPrice: number;
  discount?: number;
  user?:Customer
  reviewQuantity?: number;
  priceAfterDiscount?: number | null;
  reviewRating?: number;
}
const ProductItem = ({
  title,
  src,
  id,
  subTitle,
  originalPrice,
  user,
  href,
  priceAfterDiscount,
  type = "horizontal",
  discount,
  reviewQuantity = 1,
  reviewRating = 5,
}: ProductItemProps) => {
  const { handleAddItemToCart, isAddingError, isAddingToCart } = useAddToCart({
   product:{ id,
    originalPrice,
    quantity: 1,
    thumbnailImg: src,
    title,
    discount,
    priceAfterDiscount,},
    user
  });
  let content = (
    <Link
    data-cy='product-item-home'
      href={href}
      className='flex w-full h-[240px] shadow bg-white border rounded-lg'
    >
      <div className='min-w-[40%] w-[150px] rounded-tl-lg rounded-bl-lg aspect-[2/3] h-full overflow-hidden relative'>
        <Image
          fill
          src={src}
          sizes='(max-width: 640px) 150px, (max-width: 1200px) 30vw, 33vw'
          alt='Product Item Img'
          className='object-cover object-center'
        />
      </div>
      <div className='py-2 px-3 flex flex-col flex-1'>
        <p className='text-gray-900 text-xl font-bold'>{title}</p>
        {subTitle && (
          <p className='text-muted-foreground text-sm'>{subTitle}</p>
        )}
        <p className='text-destructive text-xl font-bold mt-2'>
          {formatPriceToVND(originalPrice)}
        </p>
        <div className='mt-2 mb-2'>
          <ReviewRating
            ratingAverage={reviewRating}
            reviewQuantity={reviewQuantity}
          />
        </div>
        <div className='flex flex-col gap-2 mt-auto sm:flex-row'>
          <Button className='flex-1'>Mua ngay</Button>
          <Button
          data-cy='product-item-add-to-cart-home'
            onClick={(e) => {
              e.preventDefault();
              handleAddItemToCart();
            }}
            disabled={isAddingToCart || isAddingError}
            className='flex-1'
            variant={"outline"}
          >
            <IoBagAddOutline className='w-6 h-6' />
          </Button>
        </div>
      </div>
    </Link>
  );
  if (type === "vertical") {
    <Link
      href={href}
      className='flex w-full  shadow bg-white border rounded-lg'
    >
      <div className='w-full min-h-[150px] relative aspect-video'>
        <Image
          fill
          src={src}
          sizes='(max-width: 640px) 150px, (max-width: 1200px) 30vw, 33vw'
          alt='Product Item Img'
          className='object-cover object-center'
        />
      </div>
      <div className='mt-4'>
        <p className='text-gray-900 text-xl font-bold'>{title}</p>
        {subTitle && (
          <p className='text-muted-foreground text-sm'>{subTitle}</p>
        )}
        <div className='mt-2 mb-2'>
          <ReviewRating
            ratingAverage={reviewRating}
            reviewQuantity={reviewQuantity}
          />
        </div>
      </div>
      <p className='text-destructive text-xl font-bold mt-2'>
        {formatPriceToVND(originalPrice)}
      </p>
    </Link>;
  }
  return content;
};

export default ProductItem;
