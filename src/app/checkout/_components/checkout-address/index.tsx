"use client";
import DeliveryAddress from "@/components/molecules/delivery-address";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageSubTitle from "@/components/ui/page-subTitle";
import useAddress from "@/hooks/use-address";

const CheckoutAddress = () => {
  const { errors, handleSubmit, register, setDistrictValue, setWardValue,setNameValue,setPhoneNumberValue } =
    useAddress();
  return (
    <form>
      
      <PageSubTitle>Địa chỉ nhận hàng</PageSubTitle>
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
};

export default CheckoutAddress;
