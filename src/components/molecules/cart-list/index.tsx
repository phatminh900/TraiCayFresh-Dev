"use client";
import { useEffect } from "react";


import { UserCart } from "@/app/cart/types/user-cart.type";
import { Product } from "@/payload/payload-types";
import { CartProductItem, useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";

import EmptyCart from "../empty-cart";
import CartItem from "./cart-item";
import { useRouter } from "next/navigation";

interface CartListProps extends IUser {
  userCart: UserCart;
}

let init = true;
const CartList = ({ user, userCart }: CartListProps) => {
  const router=useRouter()
  const cartItemLocal = useCart((store) => store.items);
  const cartItems = cartItemLocal;

  const { mutate: setUserCart, isPending: isSettingUserCart } =
    trpc.user.setUserCart.useMutation({
      onSuccess:()=>{
        router.refresh()
      }
    });
  const {
    mutate: setUserPhoneNumberCart,
    isPending: isSettingUserPhoneNumberCart,
  } = trpc.customerPhoneNumber.setUserCart.useMutation({
    onSuccess:()=>{
      router.refresh()
    }
  });


  const cartItemIds = cartItems.map((item) => item.id);
  const { data: productsRemote, refetch: getProductPrice } =
    trpc.products.getProductsPrice.useQuery(
      { ids: cartItemIds },
      { enabled: false }
    );

  const updateCartItem = useCart((store) => store.updateItem);
  const setCartItem = useCart((store) => store.setItem);

  const handleSetUserCart=(cartItems:(CartProductItem & {product:string})[])=>{
    if(user && 'email' in user){
      setUserCart(cartItems)
      return
    }
    setUserPhoneNumberCart(cartItems)
  }
  useEffect(() => {
    // logged user update to localStorage as well
    if (userCart.length && !cartItemLocal.length && init) {
      const cartItem: CartProductItem[] = userCart.map(
        ({
          product: {
            id,
            originalPrice,
            thumbnailImg,
            title,
            discount,
            priceAfterDiscount,
          },
          quantity,
          discountAmount,
          coupon,
          isAppliedCoupon,
          shippingCost,
        }) => ({
          id,
          isAppliedCoupon,
          coupon,
          discountAmount,
          shippingCost,
          originalPrice,
          quantity,
          title,
          thumbnailImg,
          discount,
          priceAfterDiscount,
        })
      );
      setCartItem(cartItem);
      init = false;
    }
  }, [userCart.length, setCartItem, userCart, cartItemLocal.length]);

  useEffect(() => {
    // if user is logged no need to send request

    if (cartItemIds.length && !userCart.length && !user) {
      getProductPrice();
    }
  }, [cartItemIds, getProductPrice, userCart.length, user]);

  // after user login update userCart

  useEffect(() => {
    // to ensure the price is matches between local and remote
    function comparePrices(
      localProducts: CartProductItem[],
      remoteProducts: Product[] | undefined
    ): void {
      if (!remoteProducts) return;
      const remotePricesMap = new Map<string, number>();
      remoteProducts.forEach((product) => {
        remotePricesMap.set(product.id, product.originalPrice);
      });

      // Compare prices
      localProducts.forEach((localProduct) => {
        const remotePrice = remotePricesMap.get(localProduct.id);
        if (remotePrice) {
          if (localProduct.originalPrice !== remotePrice) {
            updateCartItem({
              id: localProduct.id,
              data: { originalPrice: remotePrice },
            });
          }
        }
      });
    }
    // if user is logged no need to send request
    if (productsRemote?.length && !userCart.length) {
      comparePrices(cartItems, productsRemote);
    }
  }, [
    productsRemote?.length,
    productsRemote,
    cartItems,
    updateCartItem,
    userCart.length,
  ]);



  if (!cartItems.length) return <EmptyCart />;
  return (
    <ul data-cy='cart-list' className='mt-6 space-y-6'>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          isMutatingUserCart={isSettingUserCart||isSettingUserPhoneNumberCart}
          onSetUserCart={handleSetUserCart}
          id={item.id}
          priceAfterDiscount={item.priceAfterDiscount}
          originalPrice={item.originalPrice}
          quantity={item.quantity}
          src={item.thumbnailImg}
          title={item.title}
        />
      ))}
    </ul>
  );
};

export default CartList;
