import UserAddressDetails, {
  UserAddressDetailsProps,
} from "@/components/molecules/user-address-details";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface CheckoutAddressDetailsProps extends UserAddressDetailsProps {
  currentIndex: number;
  onExpand: (index: number) => void;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
}
const CheckoutAddressDetails = (props: CheckoutAddressDetailsProps) => {
  return (
    <div className='grid grid-cols-[20px_1fr] gap-3 items-start py-2'>
      <RadioGroupItem
        className='mt-8'
        value={props.id}
        id={`address-item-${props.id}`}
      />
      <UserAddressDetails {...props} />
      
    </div>
  );
};

export default CheckoutAddressDetails;
