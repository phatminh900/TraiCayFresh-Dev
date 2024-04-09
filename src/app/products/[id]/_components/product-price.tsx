"use client";

import { Button } from "@/components/ui/button";
import { formatPriceToVND } from "@/utils/util.utls";

interface ProductPriceProps {
  price: number;
}
const ProductPrice = ({ price }: ProductPriceProps) => {
  return (
    <div className='fixed bottom-0 inset-x-0 h-24 bg-gray-200 shadow-lg py-4 px-3 flex justify-between items-center md:hidden'>
      <div className='flex flex-col'>
        <p className='font-semibold'>Giá :</p>
        <p className="text-2xl text-destructive font-bold">{formatPriceToVND(price)}</p>
      </div>
      <Button size='lg'>Mua ngay</Button>
    </div>
  );
};

export default ProductPrice;
