"use client";
import { toast } from "sonner";
import { memo, useCallback } from "react";
import ErrorMsg from "@/components/atoms/error-msg";
import { Input } from "@/components/ui/input";
import { IAddressValidation } from "@/validations/user-infor.valiator";
import { useEffect, useRef, useState } from "react";
import { FieldError, FieldErrors, UseFormRegister } from "react-hook-form";
import DistrictAddress from "./districts-address";
import WardsAddress from "./wards-address";
import { cn } from "@/lib/utils";
import { SUPPORTED_PROVINCE } from "@/constants/configs.constant";
import UserNameAddress from "./user-name-address";
import UserPhoneNumberAddress from "./user-phone-number-address";

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

export interface DeliveryAddressProps {
  defaultDistrictValue?: string;
  defaultWardValue?: string;
  defaultUserName?: string;
  defaultUserPhoneNumber?: string;
  register: UseFormRegister<IAddressValidation>;
  errors: FieldErrors<IAddressValidation>;
  onSetDistrict: (district: string) => void;
  onSetName: (userName: string) => void;
  onSetPhoneNumber: (phoneNumber: string) => void;
  onSetWard: (ward: string) => void;
}

const DeliveryAddress = ({
  register,
  onSetName,
  onSetPhoneNumber,
  onSetWard,
  defaultDistrictValue,
  defaultUserName,
  defaultUserPhoneNumber,
  defaultWardValue,
  onSetDistrict,
  errors,
}: DeliveryAddressProps) => {
  const [province, setProvince] = useState("Hồ Chí Minh");
  const [districtId, setDistrictId] = useState<number | null>(null);
  const handleSetDistrictId = useCallback(
    (id: number) => setDistrictId(id),
    []
  );
  const errorsMap = useRef(
    new Map<keyof IAddressValidation, IErrorFieldType>()
  );
  const errorEntries = Object.entries(errors);
  useEffect(() => {
    if (errorEntries.length) {
      errorEntries.forEach(([key, value]) => {
        errorsMap.current = errorsMap.current.set(
          key as keyof IAddressValidation,
          value
        );
      });
    }
  }, [errorEntries]);
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex gap-4" >
        <div className="flex-1">
        <UserNameAddress onSetName={onSetName} defaultValue={defaultUserName} />
        {errors.name?.message && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.name.message === "Required"
                ? "Vui lòng chọn Phường / Xã"
                : errors.name.message
            }
          />
        )}
        </div>
       <div className="flex-1">
       <UserPhoneNumberAddress
          onSetPhoneNumber={onSetPhoneNumber}
          defaultValue={defaultUserPhoneNumber}
        />
         {errors.phoneNumber && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.phoneNumber.message === "Required"
                ? "Vui lòng chọn Phường / Xã"
                : errors.phoneNumber.message
            }
          />
        )}
       </div>
      </div>
      <div className='flex items-center gap-4'>
        <div
          className={cn("flex-1", {
            "h-[70px]": errorsMap.current.get("district")?.message,
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
            "h-[70px]": errorsMap.current.get("district")?.message,
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
          "h-[70px]": errorsMap.current.get("ward")?.message,
        })}
      >
        <WardsAddress
          defaultValue={defaultWardValue}
          onSetWard={onSetWard}
          districtId={districtId}
        />
        {errors.ward?.message && (
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
          "h-[70px]": errorsMap.current.get("street")?.message,
        })}
      >
        <Input
          {...register("street")}
          data-cy='street-address-item'
          defaultValue=''
          placeholder='Số nhà tên đường'
          id='street-address'
        />
        {errors.street?.message && (
          <ErrorMsg
            className='text-xs md:text-base'
            msg={
              errors.street.message === "required"
                ? "Vui lòng nhập số nhà và tên đường"
                : errors.street.message
            }
          />
        )}
      </div>
    </div>
  );
};

export default (DeliveryAddress);
