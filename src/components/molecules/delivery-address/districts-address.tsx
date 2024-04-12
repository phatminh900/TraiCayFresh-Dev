"use client";

import { useEffect, useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getHcmDistricts } from "@/services/address.service";
import { IDistrict } from "@/types/service.type";
import { FieldErrors } from "react-hook-form";
import { IAddressValidation } from "@/validations/user-infor.valiator";
import ErrorMsg from "@/components/atoms/error-msg";


interface DistrictAddressProps{
  onSetDistrict:(district:string)=>void
  onSetDistrictId:(id:number)=>void
}
 function DistrictAddress({onSetDistrict,onSetDistrictId}:DistrictAddressProps) {
  const [value, setValue] = useState("");
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  useEffect(() => {
    async function getDistricts() {
      const result = await getHcmDistricts();
      const districts = result?.data.filter(
        // filter some weird value
        (d) => d.DistrictName !== "33" &&d.DistrictName !== "Quận mới"
      );
      setDistricts(districts || []);
    }
    getDistricts();
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('w-full text-start flex justify-start border-gray-200 text-muted-foreground hover:bg-background focus-visible:border-primary',{
            'text-gray-800 border-gray-500':value
          })}
        >
          {value
            ? districts.find((district) => district.DistrictName === value)
                ?.DistrictName
            : "Chọn Quận / Huyện"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder='Tìm kiếm quận huyện' />
          <CommandList>
            <CommandEmpty>Không có kết quả nào được tìm thấy</CommandEmpty>
            <CommandGroup>
              {districts.map((district) => (
                <CommandItem
                  key={district.DistrictName}
                  value={district.DistrictName}
                  className='hover:bg-red'
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSetDistrictId(district.DistrictID)
                    onSetDistrict(district.DistrictName)
                    setOpen(false);
                  }}
                >
                  <IoCheckmarkOutline
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === district.DistrictName
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {district.DistrictName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default DistrictAddress