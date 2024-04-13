import { useMemo } from "react";
import { IUser } from "@/types/common-types";
import { sortIsDefaultFirst } from "@/utils/util.utls";
import UserAddressDetails from './user-address-details';

interface UserAddressDetailListProps extends IUser{}
const UserAddressDetailList = ({user}:UserAddressDetailListProps) => {
   

  const sortedAddress = useMemo(() => {
    if (user?.address) {
      return sortIsDefaultFirst(user?.address);
    }
    return [];
  }, [user?.address]);
  return (
    <ul className='space-y-3'>
    {sortedAddress?.map((ad) => {
      const address = `${ad.street} , ${ad.ward} , ${ad.district}`;
      return (
        <UserAddressDetails key={ad.id} user={user} id={ad.id!} address={address} isDefault={ad.isDefault} />
      );
    })}
  </ul>
  )
}

export default UserAddressDetailList