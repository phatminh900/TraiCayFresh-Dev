"use client";
import { toast } from "sonner";

import ErrorMsg from "@/components/atoms/error-msg";
import { Input } from "@/components/ui/input";
import { IAddressValidation } from "@/validations/user-infor.valiator";
import { useState } from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import DistrictAddress from "./districts-address";
import WardsAddress from "./wards-address";
import { cn } from "@/lib/utils";

type IErrorFieldType =
  | FieldError
  | (Record<
      string,
      Partial<{
        type: string | number;
        message: string;
      }>
    > &
      Partial<{
        type: string | number;
        message: string;
      }>);

interface DeliveryAddressProps {
  defaultDistrictValue?:string,
  defaultWardValue?:string;
  register: UseFormRegister<IAddressValidation>;
  errors: FieldErrors<IAddressValidation>;
  onSetDistrict: (district: string) => void;
  onSetWard: (ward: string) => void;
}
const SUPPORTED_PROVINCE = "Hồ Chí Minh";
const DeliveryAddress = ({
  register,
  onSetWard,
  defaultDistrictValue,defaultWardValue,
  onSetDistrict,
  errors,
}: DeliveryAddressProps) => {
  const [province, setProvince] = useState("Hồ Chí Minh");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const handleSetDistrictId = (id: number) => setDistrictId(id);
  const errorsMap = new Map<keyof IAddressValidation, IErrorFieldType>();
  const errorEntries = Object.entries(errors);
  errorEntries.forEach(([key, value]) => {
    errorsMap.set(key as keyof IAddressValidation, value);
  });
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <div
          className={cn("flex-1", {
            "h-[70px]": errorsMap.get("district")?.message,
          })}
        >
          <Input
          data-cy='province-address-item'

            value={province}
            onChange={() => setProvince(SUPPORTED_PROVINCE)}
            className='outline-none outline-0 ring-0 focus-visible:ring-0 cursor-default disabled:cursor-default disabled:border-gray-500'
            onClick={() =>
              toast.info(
                "Hiện tại shop chỉ giao hàng tại thành phố Hồ Chí Minh"
              )
            }
          />
        </div>
        <div
          className={cn("flex-1", {
            "h-[70px]": errorsMap.get("district")?.message,
          })}
        >
          <DistrictAddress
          defaultValue={defaultDistrictValue}
          currentSelectedDistrictId={districtId}
            onSetDistrict={onSetDistrict}
            onSetDistrictId={handleSetDistrictId}
          />
          {errors.district && (
            <ErrorMsg
              className='text-xs md:text-base'
              msg={
                errors.district.message === "Required"
                  ? "Vui lòng chọn Quận / Huyện"
                  : errors.district.message
              }
            />
          )}
        </div>
      </div>
      <div
        className={cn("flex-1", {
          "h-[70px]": errorsMap.get("ward")?.message,
        })}
      >
        <WardsAddress defaultValue={defaultWardValue} onSetWard={onSetWard} districtId={districtId} />
        {errors.ward && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.ward.message === "Required"
                ? "Vui lòng chọn Phường / Xã"
                : errors.ward.message
            }
          />
        )}
      </div>
      <div
        className={cn("flex-1", {
          "h-[70px]": errorsMap.get("street")?.message,
        })}
      >
        <Input
          {...register("street")}
          data-cy='street-address-item'
          defaultValue=''
          placeholder='Số nhà tên đường'
          id='street-address'
        />
        {errors.street && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={errors.street.message==='required'?"Vui lòng nhập số nhà và tên đường":errors.street.message}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
