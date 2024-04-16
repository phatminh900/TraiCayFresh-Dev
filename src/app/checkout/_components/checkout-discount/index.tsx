"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { handleTrpcSuccess } from "@/utils/success.util";
import { useCart } from "@/store/cart.store";

const CheckoutDiscount = () => {
  const setCart=useCart((store)=>store.setItem)
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
       

      }
    });
  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    applyCoupon({ coupon });
  };
  return (
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
  );
};

export default CheckoutDiscount;
