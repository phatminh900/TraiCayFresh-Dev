"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import DeliveryAddress from "@/components/molecules/delivery-address/delivery-address";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import {
  AddressValidationSchema,
  IAddressValidation,
} from "@/validations/user-infor.valiator";
import { IUser } from "@/types/common-types";
import { Customer } from "@/payload/payload-types";

interface AddNewAddressProps extends IUser {
}
const AddNewAddress = ({ user }: AddNewAddressProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<IAddressValidation>({
    resolver: zodResolver(AddressValidationSchema),
  });
  const router = useRouter();
  const {
    mutateAsync: addNewAddressUserEmail,
    isPending: isPendingUserEmail,
    isSuccess: isSuccessUserEmail,
  } = trpc.user.addNewAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      router.refresh();
      toast.message(data?.message);
    },
  });
  const {
    mutateAsync: addNewAddressPhoneNumber,
    isPending: isPendingUserPhoneNumber,
    isSuccess: isSuccessUserPhoneNumber,
  } = trpc.customerPhoneNumber.addNewAddress.useMutation({
    onError: (err) => handleTrpcErrors(err),
    onSuccess: (data) => {
      router.refresh();
      toast.message(data?.message);
    },
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const handleAddNewAddress = handleSubmit(
    async ({ district, street, ward }) => {
      // if email in user ==> login by email
      const address = { district, street, ward };
      if (user && "email" in user) {
        await addNewAddressUserEmail(address);
        setIsExpanded(false);
        return;
      }
      await addNewAddressPhoneNumber(address);
      setIsExpanded(false);
    }
  );
  const setDistrictValue = (district: string) => {
    setValue("district", district);
  };
  const setWardValue = (ward: string) => setValue("ward", ward);
  console.log(errors);

  const districtValue = watch("district");
  const wardValue = watch("ward");
  const streetValue = watch("street");
  useEffect(() => {
    // reset if the value is set
    if (Object.keys(errors).length) {
      if (districtValue) {
        setError("district", { message: "" });
      }
      if (wardValue) {
        setError("ward", { message: "" });
      }
      if (streetValue) {
        setError("street", { message: "" });
      }
    }
  }, [districtValue, streetValue, wardValue, setError, errors]);
  return (
    <div>
      <ul className='space-y-3'>
        {user?.address?.map((ad) => {
          const address = `${ad.street} , ${ad.ward} , ${ad.district}`;
          return <li key={ad.id}>
            <p>
            {address} 
            {ad.isDefault && <span className="text-sm ml-2 text-primary">( Mặc định)</span>}
            </p>
          </li>;
        })}
      </ul>
      <div className='flex flex-col gap-2'>
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className='text-primary self-start mt-1'
          >
            Thêm địa chỉ mới
          </button>
        )}
        {isExpanded && (
          <form onSubmit={handleAddNewAddress}>
            <DeliveryAddress
              errors={errors}
              onSetDistrict={setDistrictValue}
              onSetWard={setWardValue}
              register={register}
            />
            <div className='mt-4 flex items-center w-full gap-4'>
              <Button
                disabled={
                  isPendingUserEmail ||
                  isPendingUserPhoneNumber ||
                  isSuccessUserEmail ||
                  isSuccessUserPhoneNumber
                }
                className='flex-1'
              >
                {isPendingUserEmail || isPendingUserPhoneNumber
                  ? "Đang cập nhật địa chỉ"
                  : "Xác nhận"}
              </Button>
              <Button
                onClick={() => setIsExpanded(false)}
                type='button'
                className='flex-1'
                variant='destructive'
              >
                Hủy
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddNewAddress;
