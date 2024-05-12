"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/payload/payload-types";
import { formatPriceToVND } from "@/utils/util.utls";

interface ProductPriceProps {
  priceAfterDiscount: Product["priceAfterDiscount"];
  originalPrice: Product["originalPrice"];
  currentQuantityOption: number;
}
const ProductPrice = ({
  priceAfterDiscount,
  originalPrice,
  currentQuantityOption,
}: ProductPriceProps) => {
  return (
    <div className='mt-6'>
      <p>Giá:</p>
      <div className='mb-1 flex gap-2'>
        {Boolean(priceAfterDiscount) && (
          <p className='text-sm text-destructive line-through'>
            {formatPriceToVND(originalPrice)}
          </p>
        )}
        <p className='text-sm text-destructive'>
          {formatPriceToVND(priceAfterDiscount || originalPrice)}/kg
        </p>
      </div>

      <p className='font-bold text-2xl text-destructive'>
        {formatPriceToVND(
          (priceAfterDiscount || originalPrice) * currentQuantityOption
        )}
      </p>
    </div>
  );
};

export default ProductPrice;
