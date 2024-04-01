"use client";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_URL } from "@/constants/navigation.constant";
import { trpc } from "@/trpc/trpc-client";
import { toast } from "sonner";
import { ZodError } from "zod";
import { GENERAL_ERROR_MESSAGE } from "@/constants/constants.constant";
import { useForm } from "react-hook-form";
import {
  ISignUpCredential,
  SignUpCredentialSchema,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMsg from "../_component/error-msg";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import useCheckPasswordAndPasswordConfirm from "../hooks/useCheckPasswordAndPasswordConfirm";
import { InputPassword } from "@/components/ui/input-password";
import { handleTrpcErrors } from "@/utils/error.util";
import Link from "next/link";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const {
    comparePasswordAndPasswordConfirm,
    isPasswordAndPasswordConfirmSame,
  } = useCheckPasswordAndPasswordConfirm();
  const { mutate, isPending, isSuccess, isError, error } =
    trpc.auth.resetPassword.useMutation({
      // TODO: encapsulate error
      onError: (error) => {
        if (error.data?.code === "BAD_REQUEST") {
          toast.error(error.message, { duration: 5000 });

          return;
        }
        handleTrpcErrors(error);
      },
      onSuccess: () => {
        toast.success("Thay đổi mật khẩu thành công");
        setTimeout(() => {
          router.push(APP_URL.login);
        }, 500);
      },
    });
  const {
    register,
    handleSubmit,

    watch,
    getValues,

    formState: { errors, isValid },
  } = useForm<Pick<ISignUpCredential, "password" | "passwordConfirm">>({
    resolver: zodResolver(
      SignUpCredentialSchema.pick({ password: true, passwordConfirm: true })
    ),
  });

  const handleResetPassword = handleSubmit(({ password, passwordConfirm }) => {
    mutate({ password, passwordConfirm, token });
  });
  if (!token) {
    router.push(APP_URL.login);
  }
  const password = getValues("password");
  const passwordConfirm = getValues("passwordConfirm");
  useEffect(() => {
    if (isValid) {
      comparePasswordAndPasswordConfirm({ password, passwordConfirm });
    }
  }, [isValid, password, comparePasswordAndPasswordConfirm, passwordConfirm]);
  return (
    <div>
      <BreadCrumbLinks
        links={[{ href: APP_URL.resetPassword, label: "Đặt lại mặt khẩu" }]}
      />
      <h2 className='text-2xl font-bold mt-4 text-gray-800'>
        Đặt lại mật khẩu
      </h2>
      <form onSubmit={handleResetPassword} className='mt-8 grid gap-y-4'>
        <div>
          <Label htmlFor='password' className='block mb-2'>
            Mật khẩu mới
          </Label>
          <InputPassword
            {...register("password", {
              onChange: (e) => {
                if (isValid) {
                  comparePasswordAndPasswordConfirm({
                    password: e.target.value,
                    passwordConfirm,
                  });
                }
              },
            })}
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.password,
            })}
            placeholder='Mật khẩu mới'
            id='password'
          />
          {errors.password && <ErrorMsg msg={errors.password.message} />}
        </div>
        <div>
          <Label htmlFor='password-confirm' className='block mb-2'>
            Nhập lại mật khẩu mới
          </Label>
          <InputPassword
            {...register("passwordConfirm", {
              onChange: (e) => {
                if (isValid) {
                  comparePasswordAndPasswordConfirm({
                    password,
                    passwordConfirm: e.target.value,
                  });
                }
              },
            })}
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.password,
            })}
            placeholder='Nhập lại mật khẩu mới'
            id='password-confirm'
          />
          {errors.password && <ErrorMsg msg={errors.password.message} />}
          {!isPasswordAndPasswordConfirmSame && (
            <ErrorMsg msg={"Mật khẩu và xác nhận mật khẩu không giống nhau"} />
          )}
        </div>
        <Button
          disabled={
            isPending || isSuccess || error?.data?.code === "BAD_REQUEST"
          }
        >
          {isPending ? "Đang thay đổi mật khẩu" : "Xác nhận"}
        </Button>
      </form>
      {error?.data?.code === "BAD_REQUEST" && (
        <div className='text-center mt-4'>
          <p className="font-semibold mb-3">Link yêu cầu đổi mật khẩu có thể hết hạn hoặc không đúng</p>
          <Link className={buttonVariants({variant:'link'})} href={APP_URL.forgotPassword} >Vào lại trang quên mật khẩu</Link>          
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
