"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { formUserAddress } from "@/utils/util.utls";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import CheckoutAddress from "../checkout-address";
import CheckoutDetails from "../checkout-details";
import CheckoutDiscount from "../checkout-discount";
import CheckoutNote from "../checkout-note";
import CheckoutPaymentMethods from "../checkout-payment-methods";
import { toast } from "sonner";
import { handleTrpcErrors } from "@/utils/error.util";
interface CheckoutClientProps extends IUser, PropsWithChildren {}

export enum PAYMENT_METHOD {
  "BY_CASH" = "BY_CASH",
  "MOMO" = "MOMO",
  "CREDIT_TRANSFER" = "CREDIT_TRANSFER",
  "VN_PAY" = "VN_PAY",
}

export type IShippingAddress = {
  userName: string;
  userPhoneNumber: string;
  address: string;
};
const CheckoutClient = ({ user, children }: CheckoutClientProps) => {
  const router = useRouter();
  const clearCart = useCart((store) => store.clearCart);
  // checkout by cash is a little bit different than others
  const { mutateAsync: checkoutCash, isPending: isCheckingOutCash } =
    trpc.payment.payWithCash.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
    });
  const { mutate: checkoutWithMomo, isPending: isCheckingOutMomo } =
    trpc.payment.payWithMomo.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        // @ts-ignore
        if (data?.url) {
          // @ts-ignore
          router.replace(data.url);
          // clear the user cart
          clearCart();
          router.refresh();
        }
      },
    });
  const { mutate: checkoutWithVnPay, isPending: isCheckingOutVnPay } =
    trpc.payment.payWithVnPay.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        // @ts-ignore
        if (data?.url) {
          // @ts-ignore
          router.replace(data.url);
          // clear the user cart
          clearCart();
          router.refresh();
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

  const handleCheckout = async () => {
    if (paymentMethod === PAYMENT_METHOD.MOMO && shippingAddress) {
      checkoutWithMomo({ shippingAddress, orderNotes: checkoutNote });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.VN_PAY && shippingAddress) {
      checkoutWithVnPay({ shippingAddress, orderNotes: checkoutNote });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.BY_CASH && shippingAddress) {
      const result = await checkoutCash({
        shippingAddress,
        orderNotes: checkoutNote,
      }).catch((err) => handleTrpcErrors(err));
      if (result?.url) {
        router.replace(result?.url);
      }
      clearCart();
      router.refresh();
    }
  };
  const isCheckingOut =
    isCheckingOutMomo || isCheckingOutVnPay || isCheckingOutCash;

  // when checking not allowing any actions
  // useEffect(() => {
  //   if (isCheckingOut) {
  //     document.body.style.pointerEvents = "none";
  //     document
  //       .querySelectorAll("button")
  //       .forEach((button) => (button.disabled = true));
  //   }
  //   return () => {
  //     document.body.style.pointerEvents = "auto";
  //   };
  // }, [isCheckingOut]);
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
        disabled={isCheckingOut}
        onClick={handleCheckout}
        className='mt-6 w-full'
        data-cy='submit-btn-checkout'
      >
        {isCheckingOut ? "Thanh toán..." : "Thanh toán"}
      </Button>
    </>
  );
};

export default CheckoutClient;
