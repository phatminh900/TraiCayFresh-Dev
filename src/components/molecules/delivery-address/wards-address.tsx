"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getHcmWards } from "@/services/address.service";
import { IWard } from "@/types/service.type";
import  type{ DeliveryAddressProps } from ".";

interface WardAddressProps extends Pick<DeliveryAddressProps,'onSetWard'> {
  defaultValue?: string;
  districtId: number | null;
}

const WardAddress = ({
  onSetWard,
  districtId,
  defaultValue,
}: WardAddressProps) => {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [wards, setWards] = useState<IWard[]>([]);
  // when change the district reset the value
  const isDistrictChange = wards.find((ward) => ward.WardName === value);

  useEffect(() => {
    const getWards = async (districtId: number) => {
      const result = await getHcmWards(districtId);
      // in api has some unUnderstandable value starts with number (if IsNaN valid )
      const validWards = result?.data.filter((d) =>
        Number.isNaN(Number(d.WardName))
      );
      setWards(validWards || []);
      if (defaultValue) {
        setValue(defaultValue);
      }
    };
    if (districtId) {
      getWards(districtId);
    }
  }, [districtId, defaultValue]);
  useEffect(() => {
    if (!isDistrictChange) {
      setValue("");
      onSetWard("");
    }
  }, [isDistrictChange, onSetWard]);
  useEffect(() => {
    if (defaultValue) {
      onSetWard(defaultValue);
    }
  }, [defaultValue, onSetWard]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-cy='ward-address-btn'
          variant='outline'
          className={cn(
            "w-full text-start flex justify-start border-gray-200 text-muted-foreground hover:bg-background focus-visible:border-primary",
            {
              "text-gray-800 border-gray-500": value,
            }
          )}
        >
          {value
            ? wards?.find((ward) => ward.WardName === value)?.WardName
            : "Chọn Phường / Xã"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder='Tìm kiếm quận huyện' />
          <CommandList>
            <CommandEmpty>
              {!value
                ? "Vui long chọn Quận / Huyện trước"
                : "Không có kết quả nào được tìm thấy"}
            </CommandEmpty>
            <CommandGroup>
              {wards?.map((ward) => (
                <CommandItem
                  data-cy='ward-address-item'
                  key={ward.WardName}
                  value={ward.WardName}
                  className='hover:bg-red'
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSetWard(ward.WardName);
                    setOpen(false);
                  }}
                >
                  <IoCheckmarkOutline
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ward.WardName ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ward.WardName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WardAddress;
