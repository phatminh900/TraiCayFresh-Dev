import type { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import { IoCaretDownOutline } from "react-icons/io5";
import CheckoutAddressDetails from "./checkout-address-details";
import UserAddressDetails from "@/components/molecules/user-address-details";
import { IUser } from "@/types/common-types";
import { Fragment, useEffect, useMemo, useState } from "react";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import { RadioGroup } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface CheckoutAddressListProps extends IUser {
  onExpand: (state: boolean) => void;
  isFormAddExpanded: boolean;
}
const CheckoutAddressList = ({
  isFormAddExpanded,
  onExpand,
  user,
}: CheckoutAddressListProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isExpandList, setIsExpandList] = useState(false);
  const handleOpenExpandedIndex = (index: number) => {
    // if open adjust form close the add new one
    setExpandedIndex(index);
    // close the form add if we open the adjust address form
    onExpand(false);
  };
  const toggleExpandList = () => setIsExpandList((prev) => !prev);
  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);
  // if the form add is open close the adjust address form
  useEffect(() => {
    if (isFormAddExpanded) {
      setExpandedIndex(-1);
    }
  }, [isFormAddExpanded]);
  return (
    <ul className='bg-gray-200 rounded-md py-3 px-4 space-y-2'>
      <RadioGroup defaultValue={sortedAddress![0].id!}>
        {sortedAddress
          ?.slice(0, !isExpandList ? 1 : sortedAddress.length)!
          .map((ad, i) => (
            // <Fragment key={ad.id} sty >
            <CheckoutAddressDetails
              key={ad.id}
              currentIndex={expandedIndex}
              isExpandedAddressList={isExpandList}
              index={i}
              onExpand={handleOpenExpandedIndex}
              user={user}
              {...ad}
              id={ad.id!}
              isDefault={ad.isDefault!}
            />
          ))}
      </RadioGroup>
      <div className='grid grid-cols-[20px_1fr] mt-4 gap-3'>
        <div className='col-start-2 text-primary text-sm flex gap-2 items-center'>
          {/* more than 1 addresses */}
          {sortedAddress!.length > 1 && (
            <>
              <button
                onClick={toggleExpandList}
                className='flex items-center gap'
              >
                {!isExpandList ? "Xem thêm 1 địa chỉ " : "Thu gọn"}{" "}
                <IoCaretDownOutline
                  className={cn(" duration-300 transition-all", {
                    "-rotate-180": isExpandList,
                  })}
                />{" "}
              </button>

              {!isFormAddExpanded && (
                <span className='text-gray-800 text-xs'>Hoặc</span>
              )}
            </>
          )}
          {!isFormAddExpanded && (
            <button onClick={() => onExpand(true)}>Thêm địa chỉ mới</button>
          )}
        </div>
      </div>
    </ul>
  );
};

export default CheckoutAddressList;
