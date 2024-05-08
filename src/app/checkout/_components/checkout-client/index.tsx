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
import EmptyCart from "@/components/molecules/empty-cart";
import useDisableClicking from "@/hooks/use-disable-clicking";
interface CheckoutClientProps extends IUser, PropsWithChildren {}

export enum PAYMENT_METHOD {
  "BY_CASH" = "BY_CASH",
  "MOMO" = "MOMO",
  "CREDIT_TRANSFER" = "CREDIT_TRANSFER",
  "VN_PAY" = "VN_PAY",
}
type T=    Partial<IShippingAddress>

export type IShippingAddress = {
  userName: string;
  userPhoneNumber: string;
  address: string;
  id: string
};
const CheckoutClient = ({ user, children }: CheckoutClientProps) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();
  const clearCart = useCart((store) => store.clearCart);
  const cartItems=useCart(store=>store.items)
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
  const {
    mutateAsync: checkoutCash,
    isPending: isCheckingOutCash,
    isSuccess: isSuccessCheckoutCash,
  } = trpc.payment.payWithCash.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
  });
  const {
    mutate: checkoutWithMomo,
    isPending: isCheckingOutMomo,
    isSuccess: isSuccessCheckoutMomo,
  } = trpc.payment.payWithMomo.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.url) {
        // @ts-ignore
        router.push(data.url);
        // clear the user cart

        router.refresh();
      }
    },
  });
  const {
    mutate: checkoutWithVnPay,
    isPending: isCheckingOutVnPay,
    isSuccess: isSuccessCheckoutVnPay,
  } = trpc.payment.payWithVnPay.useMutation({
    onError: (err) => {
      handleTrpcErrors(err);
    },
    onSuccess: (data) => {
      // @ts-ignore
      if (data?.url) {
        // @ts-ignore
        router.push(data.url);
        // clear the user cart
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
            id: defaultUserAddress.id!,
          }
        : null
    );
  const [checkoutNote, setCheckoutNote] = useState("");
  const handleSetAddress = (shippingAddress: IShippingAddress) => {
    setShippingAddress(shippingAddress);
  };
  console.log('shipping address')
  console.log(shippingAddress)
  const handleSetPaymentMethod = (type: PAYMENT_METHOD) =>
    setPaymentMethod(type);
  const handleSetCheckoutNotes = (notes: string) => setCheckoutNote(notes);

  const handleCheckout = async () => {
    let userAddress: boolean | Promise<any> = true;
    let shippingAddressToUser:Omit<IShippingAddress,'id'>|null = shippingAddress;
  

    if (!shippingAddress) {
      // isValidShipping address => for user hasn't added address yet
      const isValidShippingAddress = await trigger();
      if (!isValidShippingAddress) {
        document
          .getElementById("delivery-address-checkout-box")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (!user!.address?.length && isValidShippingAddress) {
        const ward = watch("ward");
        const district = watch("district");
        const street = watch("street");
        const userName = watch("name");
        const userPhoneNumber = watch("phoneNumber");
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

    if (paymentMethod === PAYMENT_METHOD.MOMO && shippingAddressToUser) {
      checkoutWithMomo({
        shippingAddress: shippingAddressToUser,
        orderNotes: checkoutNote,
      });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.VN_PAY && shippingAddressToUser) {
      checkoutWithVnPay({
        shippingAddress: shippingAddressToUser,
        orderNotes: checkoutNote,
      });

      return;
    }
    if (paymentMethod === PAYMENT_METHOD.BY_CASH && shippingAddressToUser) {
      const result = await checkoutCash({
        shippingAddress: shippingAddressToUser,
        orderNotes: checkoutNote,
      }).catch((err) => handleTrpcErrors(err));
      if (result?.url) {
        router.push(result?.url);
      }
      router.refresh();
    }
  };
  const isCheckingOut =
    isCheckingOutMomo || isCheckingOutVnPay || isCheckingOutCash;
  const isSuccessCheckout =
    isSuccessCheckoutCash || isSuccessCheckoutMomo || isSuccessCheckoutVnPay;
  // when checking not allowing any actions
  useEffect(()=>{
    if(isCheckingOut){
      handleSetMutatingState(true)
    }
    if(!isCheckingOut){
      handleSetMutatingState(false)

    }
  },[isCheckingOut,handleSetMutatingState])

  // if successfully checkout clear the cart
  useEffect(() => {
    if (isSuccessCheckout) {
      clearCart();
    }
  }, [isSuccessCheckout, clearCart]);
  if(!cartItems.length) return <EmptyCart />
  return (
    <section className='checkout-page'>
      <CheckoutAddress
        onSetName={setNameValue}
        onSetPhoneNumber={setPhoneNumberValue}
        onSetDistrict={setDistrictValue}
        defaultUserName={isEmailUser(user!) ? user.name : ""}
        defaultUserPhoneNumber={!isEmailUser(user!) ? user?.phoneNumber : ""}
        onSetWard={setWardValue}
        register={register}
        errors={errors}
        currentShippingAddressId={shippingAddress?.id}
        onSetShippingAddress={handleSetAddress}
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
    </section>
  );
};

export default CheckoutClient;
