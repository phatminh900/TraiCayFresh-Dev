import DeliveryAddress from "@/components/molecules/delivery-address";
import PageSubTitle from "@/components/ui/page-subTitle";
import useAddress from "@/hooks/use-address";
import { IUser } from "@/types/common-types";
import { IoLocationOutline } from "react-icons/io5";
import CheckoutAddressList from "./checkout-address-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UserAddressFormAdd from "@/components/molecules/user-address-form-add";
import { IShippingAddress } from "../checkout-client";

export interface CheckoutAddressProps extends IUser {
  onSetShippingAddress:(shippingAddress:IShippingAddress)=>void
}

const CheckoutAddress = ({ onSetShippingAddress,user }: CheckoutAddressProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = (state: boolean) => setIsExpanded(state);
  const {
    errors,
    handleSubmit,
    register,
    setDistrictValue,
    setWardValue,
    setNameValue,
    setPhoneNumberValue,
  } = useAddress();
  const isHasAddresses = user!.address!.length > 0;


  const addNewAddressTitle = (
    <PageSubTitle className='flex items-center gap-2'>
      Thêm địa chỉ nhận hàng mới
    </PageSubTitle>
  );
  return (
    <div>
      <PageSubTitle className='flex items-center gap-2'>
        <IoLocationOutline /> Địa chỉ nhận hàng
      </PageSubTitle>
      {isHasAddresses && (
        <CheckoutAddressList
        onSetShippingAddress={onSetShippingAddress}
          isFormAddExpanded={isExpanded}
          onExpand={handleExpand}
          user={user}
        />
      )}
      {!isHasAddresses && (
        <form>
          {addNewAddressTitle}
          {/* TODO: */}
          <DeliveryAddress
            onSetName={setNameValue}
            onSetPhoneNumber={setPhoneNumberValue}
            onSetDistrict={setDistrictValue}
            onSetWard={setWardValue}
            register={register}
            errors={errors}
          />
        </form>
      )}

      {isExpanded && (
        <div>
          {addNewAddressTitle}

          <UserAddressFormAdd user={user} onExpand={setIsExpanded} />
        </div>
      )}
    </div>
  );
};

export default CheckoutAddress;
