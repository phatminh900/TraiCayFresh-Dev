import { useState } from "react";
import { Input } from "@/components/ui/input";
import type{ DeliveryAddressProps } from ".";
import { transformPhoneNumberFrom84To0 } from "@/utils/util.utls";

interface UserPhoneNumberAddressProps  extends Pick<DeliveryAddressProps,'onSetPhoneNumber'>{
  defaultValue?: string;
}
const UserPhoneNumberAddress = ({
  defaultValue,
  onSetPhoneNumber,
}: UserPhoneNumberAddressProps) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultValue && transformPhoneNumberFrom84To0(defaultValue) || "");
  return (
    <div data-cy='user-phone-number-address' className='flex-1'>
      <Input
        value={phoneNumber}
        onChange={(e) => {
          const value = e.target.value;
          setPhoneNumber(value);
          onSetPhoneNumber(value);
        }}
        placeholder='Số điện thoại'
        id='name'
      />
    </div>
  );
};

export default UserPhoneNumberAddress;
