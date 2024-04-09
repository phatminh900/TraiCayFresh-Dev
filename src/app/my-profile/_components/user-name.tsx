"use client";
import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Customer } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { SignUpCredentialSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoCreateOutline } from "react-icons/io5";
import { toast } from "sonner";

interface UserNameProps {
  userName: Customer["name"];
}
const UserName = ({ userName }: UserNameProps) => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: { name: userName },
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

  const handleChangeUserName = handleSubmit(async ({ name }) => {
    if (name === userName) return;
    await changeUserName({ name });
    setIsExpanded(false);
  });
  return (
    <div className=''>
      <div className='flex gap-4'>
        <p className='font-bold min-w-[50px]'>Tên:</p>
        <div className='flex'>
          <p data-cy='user-name-my-profile' className='font-normal min-w-[170px]  whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px] block'>
            {userName}
          </p>
          {!isExpanded && (
            <button
            data-cy='adjust-user-name-my-profile'
              onClick={handleToggleExpand}
              className='flex items-center gap-2'
            >
              <IoCreateOutline className='text-primary' />{" "}
              <span className='text-primary'>Sửa</span>{" "}
            </button>
          )}
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='min-w-[50px]'>&nbsp;</div>
        {isExpanded && (
          <form
          data-cy='user-name-form-my-profile'
            onSubmit={handleChangeUserName}
            className='my-4 w-full fade-in-15'
          >
            <Input
              className={cn("bg-slate-200 w-full", {
                "focus-visible:ring-red-500 ring-1 ring-red-400 w-full":
                  errors.name,
              })}
              {...register("name")}
            />
            {errors.name && <ErrorMsg msg={errors.name.message}/>}
            <div className='mt-4 flex gap-3'>
              <Button disabled={isChangingUserName} className='flex-1'>
                {isChangingUserName ? "Đang thay đổi..." : "Xác nhận"}
              </Button>
              <Button
                onClick={handleToggleExpand}
                disabled={isChangingUserName}
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
      {/* <div className='flex gap-4 font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
          Tên: <p className='font-normal min-w-[180px] block'>{userName}</p>
        </div>
        <button className='flex items-center gap-2'>
          <IoCreateOutline className='text-primary' />{" "}
          <span className='text-primary'>Sửa</span>{" "}
        </button>
        <form>
        <Input
          className={cn("bg-stale-200", {
            "focus-visible:ring-red-500 ring-1 ring-red-400 w-full": errors.userName,
          })}
          {...register("userName")}
        />
        <div className='mt-4 flex gap-3'>
          <Button className='flex-1'>
            {true ? "Đang thêm..." : "Xác nhận"}
          </Button>
          <Button
            // onClick={() => onExpand(-1)}
            // disabled={isPending}
            type='button'
            className='flex-1'
            variant='destructive'
          >
            Hủy
          </Button>
        </div>
      </form>  */}
      {/* <div className='flex items-center'>
        <div className='flex gap-4 font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
          Tên: <p className='font-normal min-w-[180px] block'>{userName}</p>
        </div>
       
      </div>
      <form>
        <Input
          className={cn("bg-stale-200", {
            "focus-visible:ring-red-500 ring-1 ring-red-400 w-full": errors.userName,
          })}
          {...register("userName")}
        />
        <div className='mt-4 flex gap-3'>
          <Button className='flex-1'>
            {true ? "Đang thêm..." : "Xác nhận"}
          </Button>
          <Button
            // onClick={() => onExpand(-1)}
            // disabled={isPending}
            type='button'
            className='flex-1'
            variant='destructive'
          >
            Hủy
          </Button>
        </div>
      </form> */}
    </div>
  );
};

export default UserName;
