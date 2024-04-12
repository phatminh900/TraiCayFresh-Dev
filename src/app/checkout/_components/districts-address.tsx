"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface IDistrict{DistrictName:string,code:string,districtID:number}[]

const fetchHcmAddress = async ():Promise<{data:IDistrict[]}|undefined> => {
  try {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Token: "d551f8fc-f74a-11ee-8bfa-8a2dda8ec551",
        },
        body: JSON.stringify({ province_id: 202 }),
      }
    );
    if (!response.ok) {
      throw Error("Đang có lỗi vui lòng thử lại sau");
    }
    return await response.json();
  } catch (error) {
    console.log(error);

  }
};
export function DistrictAddress() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [districts, setDistricts] = React.useState<IDistrict[]>([]);
  React.useEffect(() => {
    async function getDistricts(){
        const result= await fetchHcmAddress();
        setDistricts(result?.data||[])
    }
    getDistricts()
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between bg-background border border-gray-200'
        >
          {value
            ? districts.find((district) => district.DistrictName === value)?.DistrictName
            : "Chọn quận huyện"}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <p>Hello</p>
            {districts.map((district) => (
              <CommandItem
                key={district.DistrictName}
                value={district.DistrictName}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === district.DistrictName ? "opacity-100" : "opacity-0"
                  )}
                />
                {district.DistrictName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
