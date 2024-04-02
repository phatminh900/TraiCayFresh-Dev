"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { APP_URL } from "@/constants/navigation.constant";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Auth from "../_component/auth";
import ErrorMsg from "../_component/error-msg";
import useSignUp from "./sign-up.hook";

const SignUpPage = () => {
  const {
    signUp,
    register,
    isPending,
    isPasswordAndPasswordConfirmSame,
    watch,
    errors,
    isValid,
    comparePasswordAndPasswordConfirm,
  } = useSignUp();

  return (
    <Auth type='signUp'>
      <form
        data-cy='form-sign-up'
        onSubmit={signUp}
        className='mt-8 grid gap-y-4'
      >
        <div>
          <Label htmlFor='name' className='block mb-2'>
            Tên của bạn
          </Label>
          <Input
            data-cy='input-name-sign-up'
            {...register("name")}
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.name,
            })}
            placeholder='Tên của bạn'
            id='name'
          />
          {errors.name && <ErrorMsg msg={errors.name.message} />}
        </div>
        <div>
          <Label htmlFor='email' className='block mb-2'>
            Email
          </Label>
          <Input
            {...register("email")}
            data-cy='input-email-sign-up'
            type='email'
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.email,
            })}
            placeholder='email@gmail.com'
            id='email'
          />
          {errors.email && <ErrorMsg msg={errors.email.message} />}
        </div>
        <div>
          <Label htmlFor='password' className='block mb-2'>
            Mật khẩu
          </Label>
          <InputPassword
            {...register("password", {
              onChange: () => {
                if (isValid) {
                  comparePasswordAndPasswordConfirm({
                    password: watch("password"),
                    passwordConfirm: watch("passwordConfirm"),
                  });
                }
              },
            })}
            data-cy='input-password-sign-up'
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400": errors.password,
            })}
            placeholder='Mật khẩu'
            id='password'
          />
          {errors.password && <ErrorMsg msg={errors.password.message} />}
        </div>
        <div>
          <Label htmlFor='password-confirm' className='block mb-2'>
            Nhập lại mật khẩu
          </Label>
          <InputPassword
            {...register("passwordConfirm", {
              onChange: () => {
                if (isValid) {
                  comparePasswordAndPasswordConfirm({
                    password: watch("password"),
                    passwordConfirm: watch("passwordConfirm"),
                  });
                }
              },
            })}
            data-cy='input-password-confirm-sign-up'
            className={cn({
              "focus-visible:ring-red-500 ring-1 ring-red-400":
                errors.passwordConfirm,
            })}
            placeholder='Nhập lại mật khẩu'
            id='password-confirm'
          />
          {errors.passwordConfirm && (
            <ErrorMsg msg={errors.passwordConfirm.message} />
          )}
          {/* validate didn't work with zodResolver */}
          {!isPasswordAndPasswordConfirmSame && (
            <ErrorMsg msg={"Mật khẩu và xác nhận mật khẩu không giống nhau"} />
          )}
        </div>
        <Button type='submit' disabled={isPending}>
          {isPending ? "Đăng đăng kí" : "Đăng kí"}
        </Button>

        <Link
        data-cy='link-to-login-instead'
          href={APP_URL.login}
          className={buttonVariants({ variant: "link" })}
        >
          Đã có tài khoản. Đăng nhập tại đây &rarr;
        </Link>
      </form>
    </Auth>
  );
};

export default SignUpPage;
