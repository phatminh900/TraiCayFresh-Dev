import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

import type { DeliveryAddressProps } from ".";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserPhoneNumberAddressProps
  extends Pick<DeliveryAddressProps, "onSetPhoneNumber"|"phoneNumberList"> {
  defaultValue?: string;
  
}
const UserPhoneNumberAddress = ({
  defaultValue,
  onSetPhoneNumber,
  phoneNumberList,
}: UserPhoneNumberAddressProps) => {
  const [isOpenPhoneNumberList, setIsOpenPhoneNumberList] = useState(false);
  const [isShowListOfNumber, setIsShowListOfNumber] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(defaultValue || "");
  if (
    phoneNumberList &&
    Array.isArray(phoneNumberList) &&
    phoneNumberList.length > 1
  ) {
    const handleToggleOpenList = () => setIsOpenPhoneNumberList((prev) => prev);
    return (
      <Popover
        open={isOpenPhoneNumberList}
        onOpenChange={() => setIsOpenPhoneNumberList(true)}
      >
        <PopoverTrigger asChild>
          {!isOpenPhoneNumberList ? (
            <Button
              data-cy='district-address-btn'
              variant='outline'
              className={cn(
                "w-full text-start flex justify-start border-gray-200 text-muted-foreground hover:bg-background focus-visible:border-primary",
                {
                  "text-gray-800 border-gray-500": phoneNumber,
                }
              )}
            >
              {phoneNumber
                ? phoneNumberList?.find(
                    (number) => number.phoneNumber === phoneNumber
                  )?.phoneNumber
                : phoneNumberList.find((number) => number.isDefault)
                    ?.phoneNumber}
            </Button>
          ) : (
            <div
              onClick={() => {
                setIsShowListOfNumber(true);
              }}
            >
              <Input
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhoneNumber(value);
                  onSetPhoneNumber(value);
                  
                  if (
                    phoneNumberList.find(
                      (number) => number.phoneNumber === value
                    )
                  ) {
                    setIsShowListOfNumber(true);
                    return;
                  }
                  setIsShowListOfNumber(false);
                }}
                placeholder='Số điện thoại'
                id='name'
              />
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            {isShowListOfNumber && (
              <CommandList>
                <CommandGroup>
                  {phoneNumberList.map((number) => (
                    <CommandItem
                      data-cy='district-address-item'
                      key={number.id}
                      value={number.phoneNumber}
                      className='hover:bg-red'
                      onSelect={(currentValue) => {
                        setPhoneNumber(
                          currentValue === phoneNumber ? "" : currentValue
                        );
                        onSetPhoneNumber(number.phoneNumber);
                        setIsOpenPhoneNumberList(false);
                      }}
                    >
                      <IoCheckmarkOutline
                        className={cn(
                          "mr-2 h-4 w-4",
                          phoneNumber === number.phoneNumber
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {number.phoneNumber}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <div data-cy='user-phone-number-address' className='flex-1'>
      <Input
        value={phoneNumber}
        onChange={(e) => {
          const value = e.target.value;
          setPhoneNumber(value);
          onSetPhoneNumber(value);
        }}
        placeholder='Số điện thoại'
        id='name'
      />
    </div>
  );
};

export default UserPhoneNumberAddress;
