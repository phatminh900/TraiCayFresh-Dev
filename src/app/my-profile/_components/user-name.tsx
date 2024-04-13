"use client";

import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { SignUpCredentialSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoCreateOutline } from "react-icons/io5";
import { toast } from "sonner";

import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";

interface UserNameProps  extends IUser{
  
}
const UserName = ({ user }: UserNameProps) => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: { name: user?.name||'' },
    resolver: zodResolver(SignUpCredentialSchema.pick({ name: true })),
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const { isPending: isChangingUserName, mutateAsync: changeUserName } =
    trpc.user.changeUserName.useMutation({
      onError: (err) => {
        handleTrpcErrors(err);
      },
      onSuccess: (data) => {
        router.refresh();
        toast.success(data?.message);
      },
    });

    
  const { isPending: isAddingUserName, mutateAsync: changeUserNamePhoneNumber } =
    trpc.customerPhoneNumber.changeUserName.useMutation({onSuccess(data) {
      router.refresh();
      toast.success(data?.message);
    },});
  const handleChangeUserName = handleSubmit(async ({ name }) => {
    if (name === user?.name) return;
    if(!user) return
    // normal login by email
    if('email' in user){
      await changeUserName({ name });
    setIsExpanded(false);

    }
    if(!('email' in user)){
     await  changeUserNamePhoneNumber({name})
      setIsExpanded(false);

    }
  });

  const handleAddUserName = handleSubmit(async ({ name }) => {
    if (!name) return;
    if (name === user?.name) return;
   await  changeUserNamePhoneNumber({ name });
    setIsExpanded(false);
    router.refresh()
  });
  return (
    <div >
      <div className='flex gap'>
        <p className='min-w-[50px]'>Tên:</p>
        <div className='flex'>
          <p
            data-cy='user-name-my-profile'
            className={cn(
              "font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block",
              {
                "min-w-[150px]": user?.name,
              }
            )}
          >
            {user?.name}
          </p>
          <button
            data-cy='adjust-user-name-my-profile'
            onClick={handleToggleExpand}
            className='flex items-center gap-2'
          >
            <IoCreateOutline className='text-primary' />{" "}
            <span className='text-primary'>
              {!user?.name ? "Thêm tên của bạn" : "Sửa"}
            </span>{" "}
          </button>
        </div>
      </div>
      <div className='flex gap-4'>
        {/* <div className='min-w-[50px]'>&nbsp;</div> */}
        {isExpanded && (
          <form
            data-cy='user-name-form-my-profile'
            onSubmit={!user?.name ? handleAddUserName : handleChangeUserName}
            className='my-4 w-full fade-in-15'
          >
            <Input
              className={cn("bg-slate-200 w-full", {
                "focus-visible:ring-red-500 ring-1 ring-red-400 w-full":
                  errors.name,
              })}
              {...register("name")}
            />
            {errors.name && <ErrorMsg msg={errors.name.message} />}
            <div className='mt-4 flex gap-3'>
              <Button
                disabled={isChangingUserName || isAddingUserName}
                className='flex-1'
              >
                {isChangingUserName ? "Đang thay đổi..." : "Xác nhận"}
              </Button>
              <Button
                onClick={handleToggleExpand}
                disabled={isChangingUserName || isAddingUserName}
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

export default UserName;
