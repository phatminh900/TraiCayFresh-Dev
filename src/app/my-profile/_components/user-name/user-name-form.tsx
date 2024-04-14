"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { SignUpCredentialSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";


import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";
interface UserNameFormProps extends IUser {
  onExpand: (state: boolean) => void;
}
const UserNameForm = ({ user, onExpand }: UserNameFormProps) => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: { name: user?.name || "" },
    resolver: zodResolver(SignUpCredentialSchema.pick({ name: true })),
  });

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

  const {
    isPending: isAddingUserName,
    mutateAsync: changeUserNamePhoneNumber,
  } = trpc.customerPhoneNumber.changeUserName.useMutation({
    onSuccess(data) {
      router.refresh();
      toast.success(data?.message);
    },
  });
  const handleChangeUserName = handleSubmit(async ({ name }) => {
    if (name === user?.name) return;
    if (!user) return;
    // normal login by email
    if ("email" in user) {
      await changeUserName({ name });
      onExpand(false);
    }
    if (!("email" in user)) {
      await changeUserNamePhoneNumber({ name });
      onExpand(false);
    }
  });

  const handleAddUserName = handleSubmit(async ({ name }) => {
    if (!name) return;
    if (name === user?.name) return;
    await changeUserNamePhoneNumber({ name });
    onExpand(false);
    router.refresh();
  });
  return (
    <form
      data-cy='user-name-form-my-profile'
      onSubmit={!user?.name ? handleAddUserName : handleChangeUserName}
      className='my-4 w-full fade-in-15'
    >
      <Input
        className={cn("bg-slate-200 w-full", {
          "focus-visible:ring-red-500 ring-1 ring-red-400 w-full": errors.name,
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
          onClick={() => onExpand(false)}
          disabled={isChangingUserName || isAddingUserName}
          type='button'
          className='flex-1'
          variant='destructive'
        >
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default UserNameForm;