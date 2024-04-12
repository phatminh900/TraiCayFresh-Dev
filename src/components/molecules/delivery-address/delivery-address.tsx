'use client'
import { toast } from "sonner";

import ErrorMsg from "@/components/atoms/error-msg";
import { Input } from "@/components/ui/input";
import { IAddressValidation } from "@/validations/user-infor.valiator";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import DistrictAddress from "./districts-address";
import WardsAddress from "./wards-address";
import { cn } from "@/lib/utils";

interface DeliveryAddressProps {
  register:UseFormRegister<IAddressValidation>,
  errors:FieldErrors<IAddressValidation>,
  onSetDistrict:(district:string)=>void
  onSetWard:(ward:string)=>void
}
const SUPPORTED_PROVINCE="Hồ Chí Minh"
const DeliveryAddress = ({register,onSetWard,onSetDistrict,errors}:DeliveryAddressProps) => {
  const [province,setProvince]=useState("Hồ Chí Minh")
  const [districtId, setDistrictId] = useState<number | null>(null);
  const handleSetDistrictId = (id: number) => setDistrictId(id);
  return (
    <div className='flex flex-col gap-4'>
    <div className='flex items-center gap-4'>
      <div className={cn('flex-1',{
        'h-[70px]':Object.keys(errors).length
      })}>
        <Input   value={province} onChange={()=>setProvince(SUPPORTED_PROVINCE)} defaultValue='Hồ Chí Minh'  className="outline-none outline-0 ring-0 focus-visible:ring-0 cursor-default disabled:cursor-default disabled:border-gray-500" onClick={()=>toast.info('Hiện tại shop chỉ giao hàng tại thành phố Hồ Chí Minh')}/>
      </div>
      <div className={cn('flex-1',{
        'h-[70px]':Object.keys(errors).length
      })}>
        <DistrictAddress  onSetDistrict={onSetDistrict} onSetDistrictId={handleSetDistrictId} />
      {errors.district&&<ErrorMsg className="text-xs md:text-base" msg={errors.district.message==='Required'?"Vui lòng chọn Quận / Huyện":errors.district.message}/>}
        
      </div>
    </div>
    <div className={cn('flex-1',{
      'h-[70px]':Object.keys(errors).length
    })}>
      <WardsAddress  onSetWard={onSetWard}  districtId={districtId} />
      {errors.ward&&<ErrorMsg className="text-xs md:text-base" msg={errors.ward.message==='Required'?"Vui lòng chọn Phường / Xã":errors.ward.message}/>}

    </div>
    <div className={cn('flex-1',{
      'h-[70px]':Object.keys(errors).length
    })}>
      <Input {...register('street')} placeholder='Số nhà tên đường' id='street-address' />
      {errors.street&&<ErrorMsg className="text-xs md:text-base" msg={errors.street.message}/>}
    </div>
  </div>
  );
};

export default DeliveryAddress;
