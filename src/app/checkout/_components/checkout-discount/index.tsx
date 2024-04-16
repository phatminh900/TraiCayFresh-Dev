"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { CartProductItem, useCart } from "@/store/cart.store";
import { IUser } from "@/types/common-types";

interface CheckoutDiscountProps extends IUser{}
const CheckoutDiscount = ({user}:CheckoutDiscountProps) => {
  const setCart=useCart((store)=>store.setItem)
  const cartItems=useCart((store)=>store.items)
  const couponCode=user!.cart!.items?.find(item=>item?.coupon)?.coupon
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const { mutate: applyCoupon, isPending } =
    trpc.coupon.applyCoupon.useMutation({
      onError: (err) => {
        if(err.data?.code==='CONFLICT'){
          toast.info(err.message)
          return
        }
        handleTrpcErrors(err)

      },
      onSuccess: (data) => {
        handleTrpcSuccess(router, data?.message)
        setCoupon('')
        console.log(data)
        const updatedCart=data?.updatedUserCart
        if(updatedCart){
          const updatedCartItems:CartProductItem[]=cartItems.map((item,index)=>{
            return {...item,...updatedCart[index],quantity:updatedCart[index].quantity!,id:item.id}
          })
          console.log(updatedCartItems)
          setCart(updatedCartItems)
        }
// 
      }
    });
  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    applyCoupon({ coupon });
  };
  // if have coupon code also apply to later added items
  useEffect(()=>{
      if(couponCode){

      }
  },[couponCode])
  return (
   <div>
    {couponCode && <p className="text-muted-foreground italic text-sm">Mã giảm giá {couponCode} đã được thêm vào các sản phẩm trong giỏ</p>}
     <form onSubmit={handleApplyCoupon} className='flex items-center gap-2 mb-6'>
      <Input
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder='Mã giảm giá'
        className='w-3/5'
      />
      <Button disabled={isPending} variant='secondary' className="w-[40%]">
        {isPending ? "Đang Áp dụng" : "Áp dụng"}
      </Button>
    </form>
    </div>
  );
};

export default CheckoutDiscount;
