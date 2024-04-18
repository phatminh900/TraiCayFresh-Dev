"use client";
import { Customer, CustomerPhoneNumber } from "@/payload/payload-types";
import { useState } from "react";
import AddAdjustPhoneNumber from "../add-adjust-phone-number";
import UserPhoneNumberList from "./user-phone-number-list";

export interface UserPhoneNumberProps {
  phoneNumber: CustomerPhoneNumber["phoneNumber"] | Customer["phoneNumber"];
}
const UserPhoneNumber = ({ phoneNumber }: UserPhoneNumberProps) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const handleExpand = (index: number) => {
    setExpandedIndex(index);
  };

 
    const handleExpandIndex=(index:number)=>setExpandedIndex(index)

  return (
    <div>
      {(phoneNumber?.length || 0) > 0 ? (
        <>
          <div className='flex gap'>
            <p className='min-w-[50px]'>SĐT</p>
            {typeof phoneNumber === "string" && (
              <p className='font-bold'>{(phoneNumber)}</p>
            )}
            {Array.isArray(phoneNumber) && (
              <UserPhoneNumberList expandedIndex={expandedIndex} onExpand={handleExpandIndex} phoneNumber={phoneNumber}/>
            )}
          </div>
          {Array.isArray(phoneNumber) && (
            <AddAdjustPhoneNumber
              key={expandedIndex}
              index={phoneNumber?.length || 0}
              isExpanded={phoneNumber?.length === expandedIndex}
              onExpand={handleExpand}
              phoneCount={phoneNumber?.length || 0}
              type='add-new'
            />
          )}
        </>
      ) : Array.isArray(phoneNumber) ? (
        <div className='flex w-full flex-col gap-2 items-start mt-2'>
          <p>Bạn chưa thêm số điện thoại </p>
          <AddAdjustPhoneNumber
            index={0}
            isExpanded={0 === expandedIndex}
            onExpand={handleExpand}
            phoneCount={0}
            type='add-new'
          />
        </div>
      ) : null}
    </div>
  );
};

export default UserPhoneNumber;
