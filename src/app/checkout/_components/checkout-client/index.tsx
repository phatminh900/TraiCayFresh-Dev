"use client";
import { Button } from "@/components/ui/button";
import useAddress from "@/hooks/use-address";
import { useCart } from "@/store/cart.store";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { handleTrpcErrors } from "@/utils/error.util";
import { formUserAddress, isEmailUser } from "@/utils/util.utls";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import CheckoutAddress from "../checkout-address";
import CheckoutDetails from "../checkout-details";
import CheckoutDiscount from "../checkout-discount";
import CheckoutNote from "../checkout-note";
import CheckoutPaymentMethods from "../checkout-payment-methods";
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

  const {
    errors,
    register,
    trigger,

    setDistrictValue,
    watch,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
  } = useAddress();

  // if no user address was added before (1st time buying in the web after checking out add new user address)
  const { mutateAsync: addNewUserAddress } =
    trpc.user.addNewAddress.useMutation({});
  const { mutateAsync: addNewUserAddressUserPhoneNumber } =
    trpc.customerPhoneNumber.addNewAddress.useMutation({});

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
    let userAddress: boolean | Promise<any> = true;
    let shippingAddressToUser = shippingAddress;

    if (!shippingAddress) {
      // isValidShipping address => for user hasn't added address yet

      const isValidShippingAddress = await trigger();
      console.log(isValidShippingAddress);
      if (!isValidShippingAddress) {
        document
          .getElementById("delivery-address-checkout-box")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (!user!.address?.length && isValidShippingAddress) {
        console.log("go in here");
        const ward = watch("ward");
        const district = watch("district");
        const street = watch("street");
        const userName = watch("name");
        const userPhoneNumber = watch("phoneNumber");

        console.log(userPhoneNumber);
        const newUserAddress = {
          name: userName,
          district,
          ward,
          street,
          phoneNumber: userPhoneNumber,
        };
        userAddress = isEmailUser(user!)
          ? addNewUserAddress(newUserAddress).catch((err) =>
              handleTrpcErrors(err)
            )
          : addNewUserAddressUserPhoneNumber(newUserAddress).catch((err) =>
              handleTrpcErrors(err)
            );

        shippingAddressToUser = {
          userName,
          userPhoneNumber,
          address: formUserAddress({ street, ward, district }),
        };
      }

      // create shipping address
    }
    // if user has no address before create one
    // create user address before proceeding to checkout
    await userAddress;
    console.log("procceding checkout");

    if (paymentMethod === PAYMENT_METHOD.MOMO && shippingAddressToUser) {
      checkoutWithMomo({ shippingAddress:shippingAddressToUser, orderNotes: checkoutNote });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.VN_PAY && shippingAddressToUser) {
      checkoutWithVnPay({ shippingAddress:shippingAddressToUser, orderNotes: checkoutNote });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.BY_CASH && shippingAddressToUser) {
      const result = await checkoutCash({
        shippingAddress:shippingAddressToUser,
        orderNotes: checkoutNote,
      }).catch((err) => handleTrpcErrors(err));
      if (result?.url) {
        router.replace(result?.url);
      }
      router.refresh();
      setTimeout(() => {
        clearCart();
      });
    }
  };
  const isCheckingOut =
    isCheckingOutMomo || isCheckingOutVnPay || isCheckingOutCash;

  // when checking not allowing any actions
  useEffect(() => {
    if (isCheckingOut) {
      document.body.style.pointerEvents = "none";
      document
        .querySelectorAll("button")
        .forEach((button) => (button.disabled = true));
    }
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [isCheckingOut]);

  // if the valid enter is valid set address
  useEffect(() => {}, []);
  return (
    <>
      <CheckoutAddress
        onSetName={setNameValue}
        onSetPhoneNumber={setPhoneNumberValue}
        onSetDistrict={setDistrictValue}
        defaultUserPhoneNumber={!isEmailUser(user!) ? user?.phoneNumber : ""}
        onSetWard={setWardValue}
        register={register}
        errors={errors}
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
