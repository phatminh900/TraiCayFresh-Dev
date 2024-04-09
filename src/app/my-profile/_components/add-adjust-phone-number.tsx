"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";

import { PhoneValidationSchema } from "@/validations/user-infor.valiator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { useRouter } from "next/navigation";
import { IoCreateOutline } from "react-icons/io5";
import { GENERAL_ERROR_MESSAGE } from "@/constants/constants.constant";
import { handleTrpcErrors } from "@/utils/error.util";

const validateNumericInput = (value: string) => {
  // Regular expression to match only numeric characters
  const numericRegex = /^[0-9]*$/;
  return numericRegex.test(value);
};
interface AddNewPhoneNumberProps<Type extends "add-new" | "adjust"> {
  type: Type | "add-new";
  phoneCount?: Type extends "adjust" ? undefined : number;
  phoneAdjust?: Type extends "adjust" ? string : undefined;
  index:number
  isExpanded:boolean
  onExpand:(index:number)=>void
}

const AddAdjustPhoneNumber = <Type extends "add-new" | "adjust">({
  phoneAdjust,
  index,
  phoneCount = 0,
  onExpand,isExpanded,
  type = "add-new",
}: AddNewPhoneNumberProps<Type>) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{
    phoneNumber: string;
  }>();
  const [phoneNumber, setPhoneNumber] = useState(phoneAdjust || "");

  const router = useRouter();
  const { mutate, isPending } = trpc.user.addNewPhoneNumber.useMutation({
    onError: (err) => {
     handleTrpcErrors(err)
    },
    onSuccess: (data) => {
      router.refresh();
      onExpand(-1)
      toast.success(data?.message);
    },
  });

  const validateIsNumberEntered = (e: ChangeEvent<HTMLInputElement>) => {
    if (validateNumericInput(e.target.value)) setPhoneNumber(e.target.value);
    return;
  };

  if (!isExpanded )
    return (
      <>
        <button
          disabled={phoneCount >= 3}
          className={cn("text-primary", {
            "text-primary/70": phoneCount >= 3,
            "mt-4":type==='add-new'
          })}
          onClick={() => {
          onExpand(index)
          }}
        >
          {type === "add-new" ? (
            "Thêm số điện thoại mới"
          ) : (
            <span className='flex items-center gap-2'>
              <IoCreateOutline /> <span className='text-primary'>Sửa</span>{" "}
            </span>
          )}
        </button>
        {phoneCount >= 3 && (
          <p className='text-muted-foreground text-sm'>
            Mỗi tài khoản chỉ được thêm 3 số điện thoại
          </p>
        )}
      </>
    );
  const addNewPhoneNumber = handleSubmit(({ phoneNumber }) => {
    const rightFormatPhoneNumber = phoneNumber.replace("0", "84");
    mutate({ phoneNumber: rightFormatPhoneNumber });
  });
  return (
    <>
      <form className='w-full my-4' onSubmit={addNewPhoneNumber}>
        <Input
          type='tel'
          value={phoneNumber}
          className={cn({
            'bg-slate-200':type==='adjust',
            "focus-visible:ring-red-500 ring-1 ring-red-400 w-full":
              errors.phoneNumber,
          
          })}
          pattern='^[0-9]*$'
          {...register("phoneNumber", {
            required: "Vui lòng nhập số điện thoại",
            onChange: (e) => {
              validateIsNumberEntered(e);
            },
            validate: (val) => {
              const replace0To84 = val.replace("0", "84");

              return (
                PhoneValidationSchema.safeParse({ phoneNumber: replace0To84 })
                  .success || "Vui lòng nhập đúng số điện thoại"
              );
            },
          })}
          placeholder={
            type === "add-new" ? "Số điện thoại mới" : "Sửa số điện thoại"
          }
        />
        {errors.phoneNumber && <ErrorMsg msg={errors.phoneNumber.message} />}
        <div className='mt-4 flex gap-3'>
          <Button disabled={isPending} className='flex-1'>
            {isPending ? "Đang thêm..." : "Xác nhận"}
          </Button>
          <Button
            onClick={() => onExpand(-1)}
            disabled={isPending}
            type='button'
            className='flex-1'
            variant='destructive'
          >
            Hủy
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddAdjustPhoneNumber;
