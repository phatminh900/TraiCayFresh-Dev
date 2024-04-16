"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MAXIMUN_KG_CAN_BUY_THROUGH_WEB } from "@/constants/constants.constant";
import { CartProductItem, useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";

const useAddToCart = ({product,user}: {product: CartProductItem,user?: Customer|CustomerPhoneNumber}) => {
    const router = useRouter();
    const {
      mutateAsync: setUserPhoneNumberCart,
      isPending: isAddingToUserPhoneNumberCart,
      isError: isAddingUserCartNumberError,
    } = trpc.customerPhoneNumber.setUserCart.useMutation();
  const {
    mutateAsync: setUserCart,
    isPending: isAddingToCart,
    isError: isAddingError,
  } = trpc.user.setUserCart.useMutation();
  const cartItemsLocal = useCart((store) => store.items);
  const addItem = useCart((store) => store.addItem);
  const {
    id,
    originalPrice,
    quantity,
    thumbnailImg,
    title,
    discount,
    priceAfterDiscount,
  } = product ?? {};


  const addItemToCart=()=>{
    addItem({
      id,
      originalPrice,
      quantity,
      thumbnailImg,
      title,
      discount,
      priceAfterDiscount,
    });
  
    toast.success("Thêm vào giỏ hàng thành công", { duration: 1000 });
    router.refresh();
  }
  const handleAddItemToCart = async () => {
    const productInTheCart = cartItemsLocal.find(
      (item) => item.id === product.id
    );
    // if already in the cart and buy excess 15kg

    const updatedUserCart = productInTheCart
      ? cartItemsLocal.map((item) =>
          item.id === product.id
            ? // Make sure not over 15kg
              {
                product: item.id,
                ...item,
                quantity:
                  item.quantity + product.quantity >=
                  MAXIMUN_KG_CAN_BUY_THROUGH_WEB
                    ? 15
                    : item.quantity + product.quantity,
              }
            : { product: product.id,...item, quantity: product.quantity }
        )
      : [
          ...cartItemsLocal.map((item) => ({
            product: item.id,
            ...item,
            quantity: item.quantity,
          })),
          { product: product.id, quantity },
        ];
    if (user) {
      if('email' in user){

        await setUserCart(updatedUserCart);
       
      }
      if(!('email'in user)){
        await setUserPhoneNumberCart(updatedUserCart)
       
      }
     
    }
    addItem({
      id,
      originalPrice,
      quantity,
      thumbnailImg,
      title,
      discount,
      priceAfterDiscount,
    });
  
    toast.success("Thêm vào giỏ hàng thành công", { duration: 1000 });
    router.refresh();
  };
  return { handleAddItemToCart, isAddingError, isAddingToCart ,isAddingToUserPhoneNumberCart,isAddingUserCartNumberError};
};

export default useAddToCart;
