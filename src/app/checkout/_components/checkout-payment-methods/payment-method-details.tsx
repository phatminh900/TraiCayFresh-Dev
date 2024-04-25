import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHOD } from "../checkout-client";
import { FREESHIP_FROM } from "@/constants/configs.constant";
interface PaymentMethodDetailsProps {
  value: PAYMENT_METHOD;
  id: string;
  label: string;
  icon: ReactNode;
  freeShip?:boolean
}
const PaymentMethodDetails = ({
  value,
  icon,
  label,
  freeShip,
  id,
}: PaymentMethodDetailsProps) => {
  return (
    <div data-cy='payment-method' className='flex items-center space-x-2'>
      <RadioGroupItem value={value} id={id} />
      <Label
        className='text-base cursor-pointer flex items-center gap-1.5 md:text-lg '
        htmlFor={id}
      >
        <div  className="relative flex justify-start items-center h-[25px] min-w-[50px] max-w-[50px]">{icon}</div>
        <p >{label} {freeShip && <span className="text-xs sm:text-base">(freeship từ {FREESHIP_FROM}Đ)</span>}</p>
      </Label>
    </div>
  );
};

export default PaymentMethodDetails;
