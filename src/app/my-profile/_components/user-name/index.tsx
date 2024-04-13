"use client";

import { IUser } from "@/types/common-types";
import { useState } from "react";
import UserNameDetail from "./user-name-detail";
import UserNameForm from "./user-name-form";

interface UserNameProps  extends IUser{
  
}
const UserName = ({ user }: UserNameProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  

 
  return (
    <div >
      <UserNameDetail userName={user?.name} onToggleExpand={handleToggleExpand}/>
      <div className='flex gap-4'>
        {/* <div className='min-w-[50px]'>&nbsp;</div> */}
        {isExpanded && (
        <UserNameForm user={user} onExpand={(state)=>setIsExpanded(state)}/>
        )}
      </div>
    </div>
  );
};

export default UserName;
