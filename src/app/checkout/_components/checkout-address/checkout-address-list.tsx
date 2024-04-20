import type { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import { IoCaretDownOutline } from "react-icons/io5";
import CheckoutAddressDetails from "./checkout-address-details";
import UserAddressDetails from "@/components/molecules/user-address-details";
import { IUser } from "@/types/common-types";
import { useEffect, useMemo, useState } from "react";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface CheckoutAddressListProps extends IUser {}
const CheckoutAddressList = ({ user }: CheckoutAddressListProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isExpandList, setIsExpandList] = useState(false);
  const handleOpenExpandedIndex = (index: number) => {
    // if open adjust form close the add new one
    setExpandedIndex(index);
  };
  const toggleExpandList = () => setIsExpandList((prev) => !prev);
  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);

  return (
    <ul className='bg-gray-200 rounded-md py-3 px-4 space-y-2'>
      <RadioGroup defaultValue={sortedAddress![0].id!}>
        {sortedAddress?.slice(0,!isExpandList?1:sortedAddress.length)!.map((ad, i) => (
          <CheckoutAddressDetails
            key={ad.id}
            currentIndex={expandedIndex}
            index={i}
            onExpand={handleOpenExpandedIndex}
            user={user}
            {...ad}
            id={ad.id!}
            isDefault={ad.isDefault!}
          />
        ))}
      </RadioGroup>
      <div className='grid grid-cols-[20px_1fr] gap-3'>
        <div className='col-start-2 text-primary flex gap-4 items-center'>
          <button onClick={toggleExpandList} className="flex items-center gap">
            {!isExpandList ? "Xem thêm 1 địa chỉ " : "Thu gọn"}{" "}
            <IoCaretDownOutline
              className={cn(' duration-300 transition-all',{
                "-rotate-180": isExpandList,
              })}
            />{" "}
          </button>
          <span className='text-gray-800 '>Hoặc</span>
          <button>Thêm địa chỉ mới</button>
        </div>
      </div>
    </ul>
  );
};

export default CheckoutAddressList;
