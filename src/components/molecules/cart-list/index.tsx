"use client";
import isEqual from "lodash/isEqual";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserCart } from "@/app/cart/types/user-cart.type";
import { Product } from "@/payload/payload-types";
import { CartProductItem, useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";

import EmptyCart from "../empty-cart";
import CartItem from "./cart-item";

interface CartListProps extends IUser {
  userCart: UserCart;
}

let init = true;
const CartList = ({ user, userCart }: CartListProps) => {
  const searchParams = useSearchParams();
  const [isSetTheLocal, setIsSetTheLocal] = useState(false);
  const cartItemLocal = useCart((store) => store.items);
  // use ref to keep track the previous value
  const cartItemLocalRef = useRef(cartItemLocal);
  // user cart === login use the server instead
  const cartItems = cartItemLocal;

  const cartItemIds = cartItems.map((item) => item.id);
  const { data: productsRemote, refetch } =
    trpc.products.getProductsPrice.useQuery(
      { ids: cartItemIds },
      { enabled: false }
    );
  const { mutate: setUserCart } = trpc.user.setUserCart.useMutation();
  const { mutate: setUserPhoneNumberCart } =
    trpc.customerPhoneNumber.setUserCart.useMutation();
  const updateCartItem = useCart((store) => store.updateItem);
  const setCartItem = useCart((store) => store.setItem);

  useEffect(() => {
    // logged user update to localStorage as well
    if (userCart.length && !cartItemLocal.length && init) {
      setCartItem(userCart);
      init = false;
    }
  }, [userCart.length, setCartItem, userCart, cartItemLocal.length]);

  useEffect(() => {
    // if user is logged no need to send request

    if (cartItemIds.length && !userCart.length) {
      refetch();
    }
  }, [cartItemIds, refetch, userCart.length]);

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

  // changes make to the cart update user cart

  useEffect(() => {
    if (!isSetTheLocal && cartItemLocal.length) {
      setIsSetTheLocal(true);
      cartItemLocalRef.current = cartItemLocal;
    }
  // if the user was from the cart page (fully updated no need to send to set to cart again)
    // if any different and user is logged
    if (
      isSetTheLocal &&
      !isEqual(cartItemLocal, cartItemLocalRef.current) &&
      user
    ) {
      console.log('change in the db')
      const cartItemProducts = cartItemLocal.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const timer = setTimeout(() => {
        // only last time being sent
        if (user && "email" in user) {
          setUserCart(cartItemProducts);
          return;
        }
        setUserPhoneNumberCart(cartItemProducts);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [cartItemLocal, isSetTheLocal, user, setUserCart, setUserPhoneNumberCart]);


  if (!cartItems.length) return <EmptyCart />;
  return (
    <ul data-cy='cart-list' className='mt-6 space-y-6'>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          id={item.id}
          originalPrice={item.originalPrice}
          price={item.priceAfterDiscount || item.originalPrice}
          quantity={item.quantity}
          src={item.thumbnailImg}
          title={item.title}
        />
      ))}
    </ul>
  );
};

export default CartList;