"use client";

import { Button } from "@/components/ui/button";
import useAddToCart from "@/hooks/use-add-to-cart";
import { CartProductItem } from "@/store/cart.store";
import { IUser } from "@/types/common-types";

interface ProductAddToCartProps  extends IUser{
  product: CartProductItem;
}

const ProductAddToCart = ({user, product }: ProductAddToCartProps) => {
  const { handleAddItemToCart, isAddingError, isAddingToCart ,isAddingToUserPhoneNumberCart,isAddingUserCartNumberError} =
    useAddToCart({product,user});
  return (
    <Button
    data-cy='add-to-cart-product'
      disabled={isAddingError || isAddingToCart||isAddingUserCartNumberError||isAddingToUserPhoneNumberCart}
      onClick={handleAddItemToCart}
      size='lg'
      className='mt-2 w-full'
      variant='outline'
    >
    {isAddingToCart?"Đang thêm vào giỏ":"Thêm vào giỏ hàng"}
    </Button>
  );
};

export default ProductAddToCart;
