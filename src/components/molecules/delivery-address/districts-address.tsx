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
import { useEffect, useState ,memo} from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getHcmDistricts } from "@/services/address.service";
import { IDistrict } from "@/types/service.type";
import { DeliveryAddressProps } from ".";

interface DistrictAddressProps extends Pick<DeliveryAddressProps,'onSetDistrict'> {
  defaultValue?:string;
  currentSelectedDistrictId: number | null;
  onSetDistrictId: (id: number) => void;
}
function DistrictAddress({
  currentSelectedDistrictId,
  onSetDistrict,
  defaultValue,
  onSetDistrictId,
}: DistrictAddressProps) {
  const [value, setValue] = useState(defaultValue||'');
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const isDistrictChanged = districts.find(
    (district) => district.DistrictID === currentSelectedDistrictId
  );
  useEffect(() => {
    async function getDistricts() {
      const result = await getHcmDistricts();
      const districts = result?.data.filter(
        // filter some weird value
        (d) => d.DistrictName !== "33" && d.DistrictName !== "Quận mới"
      );
      setDistricts(districts || []);
    }
    getDistricts();
  }, []);

  useEffect(() => {
    if (!isDistrictChanged) {
      // reset the selected District
      onSetDistrict("");
    }
  }, [isDistrictChanged, onSetDistrict]);
  useEffect(()=>{
    // if have default value set DistrictId
    if(defaultValue){
      // 
      onSetDistrict(defaultValue)
      const districtId=districts.find(district=>district.DistrictName===defaultValue)
      districtId && onSetDistrictId(districtId.DistrictID)
    }
  },[defaultValue,onSetDistrictId,districts,onSetDistrict])
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-cy='district-address-btn'
          variant='outline'
          className={cn(
            "w-full text-start flex justify-start border-gray-200 text-muted-foreground hover:bg-background focus-visible:border-primary",
            {
              "text-gray-800 border-gray-500": value,
            }
          )}
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
                  data-cy='district-address-item'
                  key={district.DistrictName}
                  value={district.DistrictName}
                  className='hover:bg-red'
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSetDistrictId(district.DistrictID);
                    onSetDistrict(district.DistrictName);
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

export default memo(DistrictAddress);
