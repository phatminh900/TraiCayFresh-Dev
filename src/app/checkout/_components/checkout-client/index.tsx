"use client";
import React, { PropsWithChildren, useState } from "react";
import CheckoutAddress from "../checkout-address";
import CheckoutListCart from "../checkout-list-cart";
import CheckoutNote from "../checkout-note";
import CheckoutDiscount from "../checkout-discount";
import CheckoutPaymentMethods from "../checkout-payment-methods";
import CheckoutDetails from "../checkout-details";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/common-types";
import { formUserAddress } from "@/utils/util.utls";
import { trpc } from "@/trpc/trpc-client";
import { toast } from "sonner";
import { handleTrpcErrors } from "@/utils/error.util";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart.store";
interface CheckoutClientProps extends IUser, PropsWithChildren {}
export enum PAYMENT_METHOD {
  "BY_CASH" = "BY_CASH",
  "MOMO" = "MOMO",
  "CREDIT_TRANSFER" = "CREDIT_TRANSFER",
}

export type IShippingAddress = {
  userName: string;
  userPhoneNumber: string;
  address: string;
};
const CheckoutClient = ({ user, children }: CheckoutClientProps) => {
  const router = useRouter();
  const clearCart = useCart((store) => store.clearCart);
  const { mutate: checkoutWithMomo, isPending: isCheckingOutMomo } =
    trpc.payment.payWithMomo.useMutation({
      onError: (err) => {
        console.log(err);
        // handleTrpcErrors(err)
      },
      onSuccess: (data) => {
        // @ts-ignore
        if (data?.payUrl) {
          // @ts-ignore
          router.push(data.payUrl);
          // clear the user cart
          clearCart();
        }
      },
    });
  const userAddress = user?.address;

  const [paymentMethod, setPaymentMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.BY_CASH
  );
  const defaultUserAddress = userAddress?.find((ad) => ad.isDefault);
  const [shippingAddress, setShippingAddress] =
    useState<IShippingAddress | null>(
      defaultUserAddress
        ? {
            address: formUserAddress({
              street: defaultUserAddress.street,
              ward: defaultUserAddress.ward,
              district: defaultUserAddress.district,
            }),
            userName: defaultUserAddress.name,
            userPhoneNumber: defaultUserAddress.phoneNumber,
          }
        : null
    );
  console.log(shippingAddress);
  console.log(paymentMethod);
  const [checkoutNote, setCheckoutNote] = useState("");
  const onSetShippingAddress = (shippingAddress: IShippingAddress) => {
    setShippingAddress(shippingAddress);
  };
  const handleSetPaymentMethod = (type: PAYMENT_METHOD) =>
    setPaymentMethod(type);
  const handleSetCheckoutNotes = (notes: string) => setCheckoutNote(notes);

  const handleCheckout = () => {
    console.log("click");
    console.log(shippingAddress);
    if (paymentMethod === PAYMENT_METHOD.MOMO && shippingAddress) {
      checkoutWithMomo({ shippingAddress, orderNotes: checkoutNote });

      return;
    }
  };
  return (
    <>
      <CheckoutAddress
        onSetShippingAddress={onSetShippingAddress}
        user={user}
      />
      {children}
      {/* <CheckoutListCart /> */}
      <CheckoutNote
        onSetCheckoutNotes={handleSetCheckoutNotes}
        notes={checkoutNote}
      />
      <CheckoutDiscount user={user} />
      <CheckoutPaymentMethods
        method={paymentMethod}
        onSetPaymentMethod={handleSetPaymentMethod}
      />
      <CheckoutDetails />
      <Button
        disabled={isCheckingOutMomo}
        onClick={handleCheckout}
        className='mt-6 w-full'
        data-cy='submit-btn-checkout'
      >
        {isCheckingOutMomo ? "Thanh toán..." : "Thanh toán"}
      </Button>
    </>
  );
};

export default CheckoutClient;
