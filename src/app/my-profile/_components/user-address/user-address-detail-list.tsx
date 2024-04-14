import { useEffect, useMemo, useState } from "react";
import { IUser } from "@/types/common-types";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import UserAddressDetails from "./user-address-details";

interface UserAddressDetailListProps extends IUser {
  isExpanded: boolean;
  onExpand: (state: boolean) => void;
}
const UserAddressDetailList = ({
  user,
  isExpanded,
  onExpand,
}: UserAddressDetailListProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const handleOpenExpandedIndex = (index: number) => {
    // if open adjust form close the add new one
    setExpandedIndex(index);
    onExpand(false)
  }

  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);
  useEffect(()=>{
    // if add form open close the adjust one
    if(isExpanded){
      setExpandedIndex(-1)
    }
  },[isExpanded])
  return (
    <ul data-cy='user-address-list-my-profile' className='space-y-3'>
      {sortedAddress?.map((ad, i) => (
        <UserAddressDetails
          key={ad.id}
          currentIndex={expandedIndex}
          index={i}
          onExpand={handleOpenExpandedIndex}
          user={user}
          id={ad.id!}
          isDefault={ad.isDefault}
          ward={ad.ward}
          district={ad.district}
          street={ad.street}
        />
      ))}
    </ul>
  );
};

export default UserAddressDetailList;
