import { sortIsDefaultFirst  } from "@/utils/util.utls";
import { useMemo } from "react";
import { UserPhoneNumberProps } from ".";
import UserPhoneNumberDetails from "./user-phone-number-details";

interface UserPhoneNumberListProps extends UserPhoneNumberProps{
    expandedIndex:number
    onExpand:(index:number)=>void
}

const UserPhoneNumberList = ({phoneNumber,expandedIndex,onExpand}:UserPhoneNumberListProps) => {
   
   
    const sortedPhoneNumber = useMemo(() => {
        if (phoneNumber) {
          return sortIsDefaultFirst(phoneNumber);
        }
        return [];
      }, [phoneNumber]);
  return (
    <ul
    data-cy='phone-number-list-my-profile'
    className='w-full space-y-2'
  >
    {sortedPhoneNumber?.map((number, i) => {
      const phoneNumber = (number.phoneNumber)
      return (
        <UserPhoneNumberDetails key={number.id} id={number.id!} index={i} onExpand={onExpand} expandedIndex={expandedIndex} phoneNumber={phoneNumber} isDefault={number.isDefault!}  />
      );
    })}
  </ul>
  )
}

export default UserPhoneNumberList