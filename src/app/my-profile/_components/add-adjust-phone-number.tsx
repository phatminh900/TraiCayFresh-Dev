"use client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/trpc-client";
import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { cn } from "@/lib/utils";
import { handleTrpcErrors } from "@/utils/error.util";
import { validateNumericInput } from "@/utils/util.utls";
import {
  IPhoneNumberValidation,
  PhoneValidationSchema,
} from "@/validations/user-infor.valiator";
import ButtonAdjust from "./atoms/button-adjust";
import { handleTrpcSuccess } from "@/utils/success.util";

interface AddNewPhoneNumberProps<Type extends "add-new" | "adjust"> {
  type: Type | "add-new";
  phoneCount?: Type extends "adjust" ? undefined : number;
  phoneAdjust?: Type extends "adjust" ? string : undefined;
  index: number;
  id?: string | null;
  isExpanded: boolean;
  onExpand: (index: number) => void;
}

const AddAdjustPhoneNumber = <Type extends "add-new" | "adjust">({
  phoneAdjust,
  index,
  id,
  phoneCount = 0,
  onExpand,
  isExpanded,
  type = "add-new",
}: AddNewPhoneNumberProps<Type>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPhoneNumberValidation>();
  const [phoneNumber, setPhoneNumber] = useState(phoneAdjust || "");

  const router = useRouter();
  const { mutate: addNewPhoneNumber, isPending: isAddingNewPhoneNumber } =
    trpc.user.addNewPhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        router.refresh();
        onExpand(-1);
        toast.success(data?.message);
      },
    });
  const { mutate: adjustPhoneNumber, isPending: isAdjustingPhoneNumber } =
    trpc.user.changeUserPhoneNumber.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        onExpand(-1);
        handleTrpcSuccess(router, data?.message);
      },
    });
  const validateIsNumberEntered = (e: ChangeEvent<HTMLInputElement>) => {
    if (validateNumericInput(e.target.value)) setPhoneNumber(e.target.value);
    return;
  };

  if (!isExpanded)
    return (
      <>
        {type === "add-new" ? (
          <button
            disabled={phoneCount >= 3}
            className={cn("text-primary mt-4", {
              "text-primary/70": phoneCount >= 3,
            })}
            onClick={() => {
              onExpand(index);
            }}
          >
            Thêm số điện thoại mới
          </button>
        ) : (
          <ButtonAdjust
            disabled={phoneCount >= 3}
            onClick={() => {
              onExpand(index);
            }}
          />
        )}

        {phoneCount >= 3 && (
          <p className='text-muted-foreground text-sm'>
            Mỗi tài khoản chỉ được thêm 3 số điện thoại
          </p>
        )}
      </>
    );
  const handleAddNewPhoneNumber = handleSubmit(({ phoneNumber }) => {
    const rightFormatPhoneNumber = phoneNumber.replace("0", "84");
    if (type === "add-new") {
      addNewPhoneNumber({ phoneNumber: rightFormatPhoneNumber });
      return;
    }
    if (id) {
      adjustPhoneNumber({ phoneNumber: rightFormatPhoneNumber, id });
    }
  });
  return (
    <>
      <form className='w-full my-4' onSubmit={handleAddNewPhoneNumber}>
        <Input
          type='tel'
          value={phoneNumber}
          className={cn({
            "bg-slate-200": type === "adjust",
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
          <Button
            disabled={isAddingNewPhoneNumber || isAdjustingPhoneNumber}
            className='flex-1'
          >
            {isAddingNewPhoneNumber || isAdjustingPhoneNumber
              ? "Đang thêm..."
              : "Xác nhận"}
          </Button>
          <Button
            onClick={() => onExpand(-1)}
            disabled={isAddingNewPhoneNumber || isAdjustingPhoneNumber}
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
