"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { CartProductItem, useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";

interface CheckoutDiscountProps extends IUser {}
const CheckoutDiscount = ({ user }: CheckoutDiscountProps) => {
  const setCart = useCart((store) => store.setItem);
  const cartItems = useCart((store) => store.items);
  const couponCode = user!.cart!.items?.find((item) => item?.coupon)?.coupon;
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const { mutateAsync: applyCoupon, isPending } =
    trpc.coupon.applyCoupon.useMutation();
  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    await applyCoupon({ coupon })
      .then((data) => {
        handleTrpcSuccess(router, data?.message);
        setCoupon("");
        const updatedCart = data?.updatedUserCart;
        if (updatedCart) {
          const updatedCartItems: CartProductItem[] = cartItems.map(
            (item, index) => {
              return {
                ...item,
                ...updatedCart[index],
                quantity: updatedCart[index].quantity!,
                id: item.id,
              };
            }
          );
          setCart(updatedCartItems);
        }
      })
      .catch((err) => {
        if (err.data?.code === "CONFLICT") {
          toast.info(err.message);
          return;
        }
        handleTrpcErrors(err);
      });
  };
  const isNewlyAddedItems = cartItems.find((item) => !item.isAppliedCoupon);
  useEffect(() => {
    if (isNewlyAddedItems && couponCode) {
      // make sure only 1 request being sent
      const timer = setTimeout(async () => {
        await applyCoupon({ coupon: couponCode })
          .then((data) => {
            router.refresh()
            const updatedCart = data?.updatedUserCart;
            if (updatedCart) {
              const updatedCartItems: CartProductItem[] = cartItems.map(
                (item, index) => {
                  return {
                    ...item,
                    ...updatedCart[index],
                    quantity: updatedCart[index].quantity!,
                    id: item.id,
                  };
                }
              );
              setCart(updatedCartItems);
            }
          })
          .catch((err) => {
            if (err.data?.code === "CONFLICT") {
              toast.info(err.message);
              return;
            }
            handleTrpcErrors(err);
          });
      });
      return () => clearTimeout(timer);
    }
  }, [isNewlyAddedItems, applyCoupon, setCart, router, couponCode, cartItems]);
  return (
    <div data-cy='discount-box'>
      {couponCode && (
        <p
          data-cy='coupon-applied-notification'
          className='text-muted-foreground italic text-sm mb-2'
        >
          Mã giảm giá <span className='font-semibold'>{couponCode}</span> đã
          được thêm vào các sản phẩm trong giỏ
        </p>
      )}
      <form
        data-cy='coupon-form-checkout'
        onSubmit={handleApplyCoupon}
        className='flex items-center gap-2 mb-6'
      >
        <Input
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder='Mã giảm giá'
          className='w-3/5'
        />
        <Button disabled={isPending} variant='secondary' className='w-[40%]'>
          {isPending ? "Đang Áp dụng" : "Áp dụng"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutDiscount;
