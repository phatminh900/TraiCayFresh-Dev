"use client";
import PageSubTitle from "@/components/ui/page-subTitle";
import { IUser } from "@/types/common-types";
import { useState } from "react";
import UserAddressDetailList from "./user-address-detail-list";
import UserAddressFormAdd from "./user-address-form-add";

interface UserAddressProps extends IUser {}
const UserAddress = ({ user }: UserAddressProps) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <UserAddressDetailList user={user} />
      <div className='flex flex-col gap-2'>
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className='text-primary text-lg self-start mt-4'
          >
            Thêm địa chỉ mới
          </button>
        )}
        {isExpanded && (
          <>
            {Boolean(user?.address?.length) && (
              <PageSubTitle className='mt-4 mb-0'>
                {" "}
                Thêm địa chỉ mới
              </PageSubTitle>
            )}
         <UserAddressFormAdd isExpanded={isExpanded} user={user} onExpand={(state)=>setIsExpanded(state)}/>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAddress;
