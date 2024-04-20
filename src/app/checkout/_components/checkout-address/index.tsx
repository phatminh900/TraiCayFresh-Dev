"use client";
import DeliveryAddress from "@/components/molecules/delivery-address";
import PageSubTitle from "@/components/ui/page-subTitle";
import useAddress from "@/hooks/use-address";
import { IUser } from "@/types/common-types";
import { IoLocationOutline } from "react-icons/io5";
import CheckoutAddressList from "./checkout-address-list";

interface CheckoutAddressProps extends IUser {}

const CheckoutAddress = ({ user }: CheckoutAddressProps) => {
  const {
    errors,
    handleSubmit,
    register,
    setDistrictValue,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
  } = useAddress();

 

  let content = (
    <form>
      <PageSubTitle className='flex items-center gap-2'>
        <IoLocationOutline /> Địa chỉ nhận hàng
      </PageSubTitle>
      <DeliveryAddress
        onSetName={setNameValue}
        onSetPhoneNumber={setPhoneNumberValue}
        onSetDistrict={setDistrictValue}
        onSetWard={setWardValue}
        register={register}
        errors={errors}
      />
    </form>
  );
  if (user!.address?.length) {
    content = <CheckoutAddressList user={user} />;
  }
  return (
    <div>
      <PageSubTitle className='flex items-center gap-2'>
        <IoLocationOutline /> Địa chỉ nhận hàng
      </PageSubTitle>
      {content}
    </div>
  );
};

export default CheckoutAddress;
